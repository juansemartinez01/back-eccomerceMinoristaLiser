import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ItemPedido } from './item-pedido.entity';
import { CreateItemPedidoDto } from './dto/create-item-pedido.dto';
import { UpdateItemPedidoDto } from './dto/update-item-pedido.dto';
import { Pedido } from 'src/pedido/pedido.entity';
import { Producto } from 'src/producto/producto.entity';
import { PrecioProductoLista } from 'src/precio-producto-lista/precio-producto-lista.entity';
import { StockActual } from 'src/stock-actual/stock-actual.entity';


// 1) Creamos un tipo que no exige preciosEnListas
type ProductoConCantidad = Omit<Producto, 'preciosEnListas'> & {
  cantidad: number;
  precio_unitario: string;
};

@Injectable()
export class ItemPedidoService {
  constructor(
    @InjectRepository(ItemPedido)
    private readonly repo: Repository<ItemPedido>,
    @InjectRepository(PrecioProductoLista)
    private readonly precioListaRepo: Repository<PrecioProductoLista>,
    @InjectRepository(StockActual)
    private readonly stockRepo: Repository<StockActual>,

    private readonly dataSource: DataSource,  // para transacciones
  ) {}

  findAll(): Promise<ItemPedido[]> {
    return this.repo.find();
  }

  async findOne(id: number): Promise<ItemPedido> {
    const item = await this.repo.findOneBy({ id });
    if (!item) throw new NotFoundException(`ItemPedido ${id} no encontrado`);
    return item;
  }

  /**
   * Crea el item de pedido y descuenta inmediatamente del stock actual.
   * Lanza error si no hay suficiente stock o el registro no existe.
   */
  async create(dto: CreateItemPedidoDto): Promise<ItemPedido> {
    return this.dataSource.transaction(async manager => {
      // 1) Creo y guardo el ItemPedido
      const item = manager.getRepository(ItemPedido).create(dto);
      const savedItem = await manager.getRepository(ItemPedido).save(item);

      // 2) Busco el primer registro de stock_actual con suficiente cantidad
      const stock = await manager
        .getRepository(StockActual)
        .createQueryBuilder('stock')
        .where('stock.producto_id = :productoId', {
          productoId: dto.productoId,
        })
        .andWhere('stock.cantidad >= :cantidad', { cantidad: dto.cantidad })
        .orderBy('stock.last_updated', 'ASC')      // si querés FIFO por fecha
        .getOne();

      if (!stock) {
        throw new NotFoundException(
          `No hay stock suficiente para el producto ${dto.productoId}`
        );
      }

      // 3) Verifico disponibilidad
      if (stock.cantidad < dto.cantidad) {
        throw new BadRequestException(
          `Stock insuficiente: hay ${stock.cantidad} unidades disponibles`
        );
      }

      // 4) Ajusto y guardo el nuevo stock
      stock.cantidad -= dto.cantidad;
      await manager.getRepository(StockActual).save(stock);

      return savedItem;
    });
  }

  async update(id: number, dto: UpdateItemPedidoDto): Promise<ItemPedido> {
    await this.repo.update(id, dto as any);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const res = await this.repo.delete(id);
    if (res.affected === 0) throw new NotFoundException(`ItemPedido ${id} no encontrado`);
  }

  /**
   * Devuelve un objeto con:
   *  - pedido: toda la entidád Pedido (con sus relaciones cliente/usuario…)
   *  - productos: array de productos + cantidad + precio_unitario
   */
  async findGroupedByPedidoId(pedidoId: number): Promise<{
  pedido: Pedido;
  productos: ProductoConCantidad[];
}> {
    const items = await this.repo.find({
      where: { pedidoId },
      relations: [
        'pedido',
        'pedido.cliente',
        'pedido.usuario',
        'producto',
        'producto.unidad',
        'producto.tipoProducto',
        'producto.stocksActuales',
        'producto.movimientosStock',
      ],
    });

    if (items.length === 0) {
      throw new NotFoundException(`No se encontraron items para el pedido ${pedidoId}`);
    }

    // 2) Extraigo el pedido y la lista de precios asignada al cliente (puede ser null)
    const { pedido } = items[0];
    const listaId = pedido.cliente.listaPreciosId;

    // 3) Si hay lista, cargo todos sus precios de una sola vez
    let entradasDePrecio: PrecioProductoLista[] = [];
    if (listaId) {
      entradasDePrecio = await this.precioListaRepo.find({
        where: { lista: { id: listaId } }
      });
    }
    // Construyo un map productoId → precioUnitario
    const precioMap = new Map<number, number>();
    for (const e of entradasDePrecio) {
      precioMap.set(
        typeof e.producto === 'number' ? e.producto : e.producto.id,
        e.precioUnitario
      );
    }

    // 4) Mapear items a ProductoConCantidad, eligiendo:
    //    - precio de lista si existe
    //    - o precio_base del producto
const productos: ProductoConCantidad[] = items.map(item => {
  const p = item.producto;
  const precioDeLista = precioMap.get(p.id);
  const precio_unitario = item.precio_unitario.toString();
  return {
    // todas las props de Producto excepto 'preciosEnListas'
    id: p.id,
    nombre: p.nombre,
    precio_base: p.precio_base,
    unidadId: p.unidadId,
    unidad: p.unidad,
    tipoProductoId: p.tipoProductoId,
    tipoProducto: p.tipoProducto,
    descripcion: p.descripcion,
    vacio: p.vacio,
    oferta: p.oferta,
    precio_oferta: p.precio_oferta,
    activo: p.activo,
    imagen: p.imagen,
    precioVacio: p.precioVacio,
    created_at: p.created_at,
    updated_at: p.updated_at,
    id_interno: p.id_interno,
    stocksActuales: p.stocksActuales,
    movimientosStock: p.movimientosStock,
    empresa: p.empresa,

    // campos del item
    itemPedidoId:    item.id,
    cantidad: item.cantidad,
    precio_unitario: precio_unitario,
    comentario: item.comentario || null, // puede ser null
  };
});


    return { pedido, productos };
  }
}