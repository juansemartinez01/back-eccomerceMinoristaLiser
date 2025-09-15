import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { StockActual } from './stock-actual.entity';
import { CreateStockActualDto } from './dto/create-stock-actual.dto';
import { UpdateStockActualDto } from './dto/update-stock-actual.dto';
import { MovimientoStock } from 'src/movimiento-stock/movimiento-stock.entity';
import { AgregarStockDto } from './dto/agregar-stock.dto';
import { Producto } from '../producto/producto.entity';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class StockActualService implements OnModuleInit {
  constructor(
    @InjectRepository(StockActual)
    private readonly repo: Repository<StockActual>,
    private readonly dataSource: DataSource,
  ) {}
  onModuleInit() {
    console.log('StockActualService inicializado y crons activos');
  }


  
  findAll(): Promise<StockActual[]> {
    return this.repo.find({ relations: ['producto', 'almacen'] });
  }

  async findOne(
    producto_id: number,
    almacen_id: number,
  ): Promise<StockActual> {
    const stock = await this.repo.findOne({
      where: { producto_id, almacen_id },
      relations: ['producto', 'almacen'],
    });
    if (!stock)
      throw new NotFoundException(
        `Stock no encontrado para producto ${producto_id} en almacén ${almacen_id}`,
      );
    return stock;
  }

  async create(dto: CreateStockActualDto): Promise<StockActual> {
    const stock = this.repo.create(dto);
    return this.repo.save(stock);
  }

  async update(
    producto_id: number,
    almacen_id: number,
    dto: UpdateStockActualDto,
  ): Promise<StockActual> {
    await this.repo.update({ producto_id, almacen_id }, dto as any);
    return this.findOne(producto_id, almacen_id);
  }

  async remove(producto_id: number, almacen_id: number): Promise<void> {
    const res = await this.repo.delete({ producto_id, almacen_id });
    if (res.affected === 0)
      throw new NotFoundException(
        `Stock no encontrado para producto ${producto_id} en almacén ${almacen_id}`,
      );
  }

  /**
   * Cambia el stock de un producto en un almacén dado.
   * @param productoId ID del producto a actualizar
   * @param almacenId  ID del almacén
   * @param delta      Positivo para incrementar, negativo para decrementar
   */
  async changeStock(
    productoId: number,
    almacenId: number,
    delta: number,
  ): Promise<StockActual> {
    // 1) Busca la fila existente
    const stock = await this.repo.findOne({
      where: {
        producto: { id: productoId },
        almacen: { id: almacenId },
      },
    });

    if (!stock) {
      throw new NotFoundException(
        `No existe stock para producto ${productoId} en almacén ${almacenId}`,
      );
    }

    // 2) Aplica el cambio y actualiza la fecha
    stock.cantidad += delta;
    stock.last_updated = new Date();

    // 3) Guarda y devuelve el registro actualizado
    return this.repo.save(stock);
  }

  async agregarStock(dto: AgregarStockDto): Promise<void> {
  await this.dataSource.transaction(async manager => {
    const { productoId, almacenId, cantidad, usuarioId } = dto;

    // 1) Crear el movimiento de stock
    const movimiento = manager.getRepository(MovimientoStock).create({
      producto: productoId,
      origenAlmacen: null,
      destinoAlmacen: almacenId,
      cantidad,
      tipo: 'entrada',
      fecha: new Date(),
      usuario_id: usuarioId,
      motivo: 'Ingreso manual de stock',
    } as unknown as MovimientoStock);
    await manager.getRepository(MovimientoStock).save(movimiento);

    // 2) Buscar el stock actual
    let stock = await manager.getRepository(StockActual).findOne({
      where: {
        producto: { id: productoId },
        almacen: { id: almacenId },
      },
    });

    // 3) Si no existe, crearlo; si existe, actualizar
    if (!stock) {
      stock = manager.getRepository(StockActual).create({
        producto: { id: productoId },
        almacen: { id: almacenId },
        cantidad,
        lastUpdated: new Date(),
      } as unknown as StockActual);
    } else {
      stock.cantidad += cantidad;
      stock.last_updated = new Date();
    }

    await manager.getRepository(StockActual).save(stock);
  });
}

//Metodo que agrega 4000 unidades de stock a todos los productos en el almacén 1 todos los días a las 00:00
  /**
   * Resetea el stock diario a 4000 unidades para todos los productos del almacén 1.
   * Este método se ejecuta automáticamente todos los días a la medianoche.
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleResetStockDiario() {
  console.log('⏰ [CRON] Ejecutando tarea de reseteo de stock...');
  try {
    const result = await this.resetStockDiario();
    console.log(`✅ [CRON] Stock reseteado a 4000 en ${result.updated} registros`);
  } catch (error) {
    console.error('❌ [CRON] Error al resetear stock automáticamente:', error);
  }
}


async resetStockDiario(): Promise<{ updated: number; totalProductos: number; message: string }> {
  // 1. Contar productos totales
  const totalProductos = await this.dataSource
    .getRepository(Producto)
    .count();

  // 2. Ejecutar el UPDATE
  const result = await this.repo
    .createQueryBuilder()
    .update()
    .set({ cantidad: 4000 })
    .where("almacen_id = :almacenId", { almacenId: 1 })
    .execute();

  const updated = result.affected || 0;

  // 3. Determinar el mensaje
  let message = '';
  if (updated === totalProductos) {
    message = '✅ La cantidad fue actualizada en todos los productos del almacén.';
  } else if (updated > totalProductos) {
    message = '⚠️ Se actualizaron más registros de los que hay en la tabla productos.';
  } else {
    message = '⚠️ No todos los productos tienen stock cargado para este almacén.';
  }

  console.log(message);

  return {
    updated,
    totalProductos,
    message,
  };
}




}