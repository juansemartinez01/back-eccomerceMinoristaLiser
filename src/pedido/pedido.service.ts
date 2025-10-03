import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Pedido } from './pedido.entity';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { ItemPedido } from 'src/item-pedido/item-pedido.entity';
import { StockActual } from 'src/stock-actual/stock-actual.entity';
import { CreatePedidoWithItemsDto } from './dto/create-pedido-with-items.dto';
import { UsuarioService } from 'src/usuario/usuario.service';
import { PedidoManual } from 'src/pedido-manual/pedido-manual.entity';
import { Producto } from 'src/producto/producto.entity';
import { CrearPedidoWebDto } from './dto/create-pedido-web.dto';

@Injectable()
export class PedidoService {
  constructor(
    @InjectRepository(Pedido)
    private readonly pedidoRepo: Repository<Pedido>,

    @InjectRepository(ItemPedido)
    private readonly itemRepo: Repository<ItemPedido>,

    @InjectRepository(StockActual)
    private readonly stockRepo: Repository<StockActual>,

    private readonly dataSource: DataSource,

    private readonly usuarioService: UsuarioService,
  ) {}

  async findAll(
    page: number = 1,
    limit: number = 50,
  ): Promise<{
    data: Pedido[];
    total: number;
    page: number;
    limit: number;
  }> {
    const [data, total] = await this.pedidoRepo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'DESC' },
    });

    return { data, total, page, limit };
  }

  async findOne(id: number): Promise<Pedido> {
    const pedido = await this.pedidoRepo.findOneBy({ id });
    if (!pedido) throw new NotFoundException(`Pedido ${id} no encontrado`);
    return pedido;
  }

  create(dto: CreatePedidoDto): Promise<Pedido> {
    const pedido = this.pedidoRepo.create(dto);
    return this.pedidoRepo.save(pedido);
  }

  async update(id: number, dto: UpdatePedidoDto): Promise<Pedido> {
    const pedido = await this.findOne(id);

    if (dto.clienteId !== undefined)
      pedido.cliente = { id: dto.clienteId } as any;

    if (dto.usuarioId !== undefined)
      pedido.usuario = { id: dto.usuarioId } as any;

    if (dto.armadorId !== undefined)
      pedido.armador = { id: dto.armadorId } as any;

    if (dto.entregadorId !== undefined)
      pedido.entregador = { id: dto.entregadorId } as any;

    if (dto.fechaHora !== undefined) pedido.fechaHora = new Date(dto.fechaHora);

    if (dto.canal !== undefined) pedido.canal = dto.canal;

    if (dto.estado !== undefined) pedido.estado = dto.estado;

    if (dto.estadoPago !== undefined) pedido.estadoPago = dto.estadoPago;

    return this.pedidoRepo.save(pedido);
  }

  async remove(id: number): Promise<void> {
    const res = await this.pedidoRepo.delete(id);
    if (res.affected === 0)
      throw new NotFoundException(`Pedido ${id} no encontrado`);
  }

  async createWithItems(dto: CreatePedidoWithItemsDto): Promise<Pedido> {
    return this.dataSource.transaction(async (manager) => {
      // 1) Creo el pedido
      const pedido = manager.getRepository(Pedido).create({
        cliente: dto.clienteId ? { id: dto.clienteId } : null,
        usuario: { id: dto.usuarioId },
        fechaHora: new Date(dto.fechaHora),
        canal: dto.canal,
        estado: dto.estado,
        armador: dto.armadorId ? { id: dto.armadorId } : null,
        entregador: dto.entregadorId ? { id: dto.entregadorId } : null,
        estadoPago: dto.estadoPago,
      } as Pedido);

      const savedPedido = await manager.getRepository(Pedido).save(pedido);

      // 2) Por cada ítem: lo guardo y actualizo stock
      for (const it of dto.items) {
        // 2.1) Crear línea de pedido
        const item = manager.getRepository(ItemPedido).create({
          pedido: savedPedido,
          producto: { id: it.productoId },
          cantidad: it.cantidad,
          precio_unitario: it.precio_unitario,
          comentario: it.comentario,
        });
        await manager.getRepository(ItemPedido).save(item);

        // 2.2) Obtener stock disponible (FIFO por fecha)
        const stock = await manager
          .getRepository(StockActual)
          .createQueryBuilder('stock')
          .where('stock.producto_id = :productoId', {
            productoId: it.productoId,
          })
          .andWhere('stock.cantidad >= :cantidad', { cantidad: it.cantidad })
          .orderBy('stock.last_updated', 'ASC')
          .getOne();

        if (!stock) {
          const producto = await manager
            .getRepository(Producto)
            .findOneBy({ id: it.productoId });
          const stockReal = await manager
            .getRepository(StockActual)
            .createQueryBuilder('stock')
            .select('SUM(stock.cantidad)', 'cantidad')
            .where('stock.producto_id = :productoId', {
              productoId: it.productoId,
            })
            .getRawOne();

          const cantidadDisponible = stockReal?.cantidad ?? 0;
          throw new NotFoundException(
            `No hay stock suficiente para el producto ${producto?.nombre ?? it.productoId}. El stock actual es ${cantidadDisponible}.`,
          );
        }

        // 2.3) Descontar y guardar
        stock.cantidad -= it.cantidad;
        await manager.getRepository(StockActual).save(stock);
      }
      // 3) Actualizar última compra del usuario
      await this.usuarioService.update(dto.usuarioId, {
        ultimaCompra: new Date(),
      });

      return savedPedido;
    });
  }

  async cancelarPedido(pedidoId: number): Promise<Pedido> {
    return this.dataSource.transaction(async (manager) => {
      // 1) Traer el pedido con sus ítems
      const pedido = await manager.getRepository(Pedido).findOne({
        where: { id: pedidoId },
        relations: ['items', 'items.producto'],
      });

      if (!pedido) {
        throw new NotFoundException(`Pedido ${pedidoId} no encontrado`);
      }

      if (pedido.estado === 'Cancelado') {
        throw new BadRequestException(`El pedido ${pedidoId} ya fue cancelado`);
      }

      // 2) Revertir stock por cada ítem
      for (const item of pedido.items) {
        // Buscar el stock actual
        const stock = await manager.getRepository(StockActual).findOne({
          where: { producto: { id: item.producto.id } },
        });

        if (!stock) {
          throw new NotFoundException(
            `No se encontró stock para el producto ${item.producto.id}`,
          );
        }

        // Sumar la cantidad nuevamente
        stock.cantidad += item.cantidad;
        await manager.getRepository(StockActual).save(stock);
      }

      // 3) Marcar pedido como cancelado
      pedido.estado = 'Cancelado';
      await manager.getRepository(Pedido).save(pedido);

      return pedido;
    });
  }

  async obtenerTodosConNombreClienteManual(
    fechaDesde?: string,
    fechaHasta?: string,
    estado?: string,
    estadoPago?: string,
    clienteId?: number,
    usuarioId?: number,
    page: number = 1,
    limit: number = 50,
    ordenCampo: string = 'fechaHora',
    ordenDireccion: 'ASC' | 'DESC' = 'ASC',
  ): Promise<{
    data: any[];
    total: number;
    page: number;
    limit: number;
  }> {
    const query = this.pedidoRepo
      .createQueryBuilder('pedido')
      .leftJoin('pedido.cliente', 'cliente')
      .leftJoin('pedido.usuario', 'usuario')
      .leftJoin('pedido.armador', 'armador')
      .leftJoin('pedido.entregador', 'entregador')
      .select([
        'pedido.id',
        'pedido.estado',
        'pedido.fechaHora',
        'pedido.canal',
        'pedido.estadoPago',
        'cliente.id',
        'cliente.nombre',
        'usuario.id',
        'usuario.nombre',

        'armador.id',
        'armador.nombre',

        'entregador.id',
        'entregador.nombre',
      ])
      .skip((page - 1) * limit)
      .take(limit);

    if (fechaDesde) {
      query.andWhere('pedido.fechaHora >= :fechaDesde', {
        fechaDesde: new Date(fechaDesde),
      });
    }

    if (fechaHasta) {
      query.andWhere('pedido.fechaHora <= :fechaHasta', {
        fechaHasta: new Date(fechaHasta),
      });
    }

    if (estado) {
      const estados = estado
        .split(',')
        .map((e) => e.trim())
        .filter(Boolean);
      if (estados.length > 0) {
        query.andWhere('pedido.estado IN (:...estados)', { estados });
      }
    }

    if (estadoPago) {
      const estadosPago = estadoPago
        .split(',')
        .map((e) => e.trim())
        .filter(Boolean);
      if (estadosPago.length > 0) {
        query.andWhere('pedido.estadoPago IN (:...estadosPago)', {
          estadosPago,
        });
      }
    }

    if (clienteId) {
      query.andWhere('cliente.id = :clienteId', { clienteId });
    }

    if (usuarioId) {
      query.andWhere('usuario.id = :usuarioId', { usuarioId });
    }

    const camposValidos = ['fechaHora', 'id'];
    const campoOrdenFinal = camposValidos.includes(ordenCampo)
      ? ordenCampo
      : 'fechaHora';
    query.orderBy(`pedido.${campoOrdenFinal}`, ordenDireccion);

    const [pedidos, total] = await query.getManyAndCount();

    const pedidoIdsPagina = pedidos.map((p) => p.id);

    let pedidosManualesRaw: any[] = [];
    if (pedidoIdsPagina.length > 0) {
      pedidosManualesRaw = await this.dataSource
        .getRepository(PedidoManual)
        .createQueryBuilder('pm')
        .select([
          'pm.pedido_id AS pedido_id',
          'pm.nombre_cliente AS nombre_cliente',
        ])
        .where('pm.pedido_id IN (:...ids)', { ids: pedidoIdsPagina })
        .getRawMany();
    }

    const nombreManualPorPedidoId = new Map<number, string>();
    for (const pm of pedidosManualesRaw) {
      if (pm.pedido_id && pm.nombre_cliente) {
        nombreManualPorPedidoId.set(Number(pm.pedido_id), pm.nombre_cliente);
      }
    }

    const data = pedidos.map((pedido) => ({
      ...pedido,
      nombreClienteManual:
        nombreManualPorPedidoId.get(pedido.id) ??
        pedido.cliente?.nombre ??
        null,
    }));

    return {
      data,
      total,
      page,
      limit,
    };
  }

  // ✅ PRECIO SOLO POR LISTA → fallback a productos.precio_base
  private async precioWebDe(m: any, productoId: number): Promise<number> {
    const listaId = Number(process.env.LISTA_PRECIOS_WEB) || 1;

    // Un único query: si hay precio en la lista, lo usa; si no, usa precio_base.
    const row = await m.query(
      `
    SELECT
      COALESCE(ppl.precio_unitario, p.precio_base)::numeric AS precio
    FROM productos p
    LEFT JOIN precio_producto_lista ppl
      ON ppl.producto_id = p.id
     AND ppl.lista_id = $2
    WHERE p.id = $1
    LIMIT 1
    `,
      [productoId, listaId],
    );

    const precio = row?.[0]?.precio;
    return precio !== undefined && precio !== null ? Number(precio) : 0;
  }

  /** POST /pedidos/web  → crea el pedido, calcula precios, descuenta stock y deja estado PENDIENTE */
  async crearPedidoWeb(dto: CrearPedidoWebDto): Promise<Pedido> {
    const clienteId = Number(process.env.CLIENTE_WEB_ID) || 999999;
    const usuarioId = Number(process.env.USUARIO_WEB_ID) || 1;
    const canal = process.env.CANAL_WEB || 'WEB';

    return this.dataSource.transaction(async (m) => {
      // 1) Crear pedido base
      const pedido = m.getRepository(Pedido).create({
        cliente: { id: clienteId } as any, // cliente “guest”
        usuario: { id: usuarioId } as any, // usuario “sistema web”
        fechaHora: new Date(),
        canal,
        estado: 'PENDIENTE',
        estadoPago: 'PENDIENTE',
        contacto: dto.contacto, // JSONB
      } as Pedido);
      const saved = await m.getRepository(Pedido).save(pedido);

      // 2) Procesar items: validar producto, calcular precio, verificar y descontar stock, grabar ítem
      for (const it of dto.items) {
        // 2.1) Validar que el producto exista (evita violación de FK)
        const prod = await m
          .getRepository(Producto)
          .findOne({ where: { id: it.producto_id } });
        if (!prod) {
          throw new NotFoundException(
            `El producto ${it.producto_id} no existe`,
          );
        }

        // 2.2) Precio: lista web → fallback a productos.precio_base
        const pUnit = await this.precioWebDe(m, it.producto_id);

        // 2.3) Verificar stock (simple: una fila por producto en stock_actual, FIFO por last_updated)
        const stock = await m
          .getRepository(StockActual)
          .createQueryBuilder('sa')
          .where('sa.producto_id = :pid', { pid: it.producto_id })
          .orderBy('sa.last_updated', 'ASC')
          .getOne();

        // Si no hay suficiente, calculamos disponible total para el mensaje
        if (!stock || Number(stock.cantidad) < it.cantidad) {
          const total = await m
            .getRepository(StockActual)
            .createQueryBuilder('sa')
            .select('COALESCE(SUM(sa.cantidad), 0)', 'disp')
            .where('sa.producto_id = :pid', { pid: it.producto_id })
            .getRawOne<{ disp: string }>();
          const disponible = Number(total?.disp ?? 0);
          throw new BadRequestException(
            `Stock insuficiente para ${prod.nombre} (ID ${prod.id}). Disponible: ${disponible}, solicitado: ${it.cantidad}`,
          );
        }

        // 2.4) Descontar y persistir stock
        stock.cantidad = Number(stock.cantidad) - it.cantidad;
        await m.getRepository(StockActual).save(stock);

        // 2.5) Crear ítem del pedido
        const item = m.getRepository(ItemPedido).create({
          pedido: saved,
          producto: { id: it.producto_id } as any,
          cantidad: it.cantidad,
          precio_unitario: pUnit,
        });
        await m.getRepository(ItemPedido).save(item);
      }

      // 3) Pedido queda en PENDIENTE (no se cambia estado aquí)
      return saved;
    });
  }
}