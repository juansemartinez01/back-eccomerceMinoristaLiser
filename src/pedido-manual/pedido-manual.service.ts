import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { PedidoManual } from './pedido-manual.entity';
import { CreatePedidoManualDto } from './dto/create-pedido-manual.dto';
import { UpdatePedidoManualDto } from './dto/update-pedido-manual.dto';
import { Pedido } from 'src/pedido/pedido.entity';
import { ItemPedido } from 'src/item-pedido/item-pedido.entity';
import { StockActual } from 'src/stock-actual/stock-actual.entity';

@Injectable()
export class PedidoManualService {
  constructor(
    @InjectRepository(PedidoManual)
    private readonly repo: Repository<PedidoManual>,
    private readonly dataSource: DataSource,
  ) {}

  findAll(): Promise<PedidoManual[]> {
    return this.repo.find();
  }

  async findOne(id: number): Promise<PedidoManual> {
    const pm = await this.repo.findOneBy({ id });
    if (!pm) throw new NotFoundException(`PedidoManual ${id} no encontrado`);
    return pm;
  }

  

  async update(id: number, dto: UpdatePedidoManualDto): Promise<PedidoManual> {
    await this.repo.update(id, dto as any);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const res = await this.repo.delete(id);
    if (res.affected === 0) throw new NotFoundException(`PedidoManual ${id} no encontrado`);
  }

  async createManual(dto: CreatePedidoManualDto): Promise<Pedido> {
  return this.dataSource.transaction(async manager => {
    // 1) Crear el pedido principal
    const pedido = manager.getRepository(Pedido).create({
      cliente: { id: dto.clienteId ?? 1 },
      usuario: { id: dto.usuarioId },
      fechaHora: new Date(dto.fechaHora),
      canal: dto.canal,
      estado: dto.estado,
      armador: dto.armadorId ? { id: dto.armadorId } : null,
      entregador: dto.entregadorId ? { id: dto.entregadorId } : null,
      estadoPago: dto.estadoPago,
    } as Pedido);

    const savedPedido = await manager.getRepository(Pedido).save(pedido);

    // 2) Guardar ítems y actualizar stock
    for (const it of dto.items) {
      const item = manager.getRepository(ItemPedido).create({
        pedido: savedPedido,
        producto: { id: it.productoId },
        cantidad: it.cantidad,
        precio_unitario: it.precio_unitario,
      });
      await manager.getRepository(ItemPedido).save(item);

      const stock = await manager
        .getRepository(StockActual)
        .createQueryBuilder('stock')
        .where('stock.producto_id = :productoId', { productoId: it.productoId })
        .andWhere('stock.cantidad >= :cantidad', { cantidad: it.cantidad })
        .orderBy('stock.last_updated', 'ASC')
        .getOne();

      if (!stock) {
        throw new NotFoundException(
          `No hay stock suficiente para el producto ${it.productoId}`
        );
      }

      stock.cantidad -= it.cantidad;
      await manager.getRepository(StockActual).save(stock);
    }

    const fechaValida = dto.fechaCarga ? new Date(dto.fechaCarga) : new Date();
    if (isNaN(fechaValida.getTime())) {
      throw new BadRequestException('La fechaCarga no es válida');
    }



    // 3) Crear el pedido manual asociado
    const pedidoManual = manager.getRepository(PedidoManual).create({
      cliente: { id: dto.clienteId },
      usuario: { id: dto.usuarioId },
      mensajeOriginal: "Pedido manual creado",
      fechaCarga: fechaValida,
      pedido: savedPedido,
      nombreCliente: dto.nombreCliente,
    });

    await manager.getRepository(PedidoManual).save(pedidoManual);

    return savedPedido;
  });
}

}