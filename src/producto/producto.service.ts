import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Producto } from './producto.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { StockActual } from 'src/stock-actual/stock-actual.entity';

@Injectable()
export class ProductoService {
  constructor(
    @InjectRepository(Producto)
    private readonly repo: Repository<Producto>,
    private readonly dataSource: DataSource,
  ) {}

  async onModuleInit() {
    await this.normalizarNombresProductos();
  }

  findAll(): Promise<Producto[]> {
    return this.repo.find({
      relations: [
        'unidad',
        'tipoProducto',
        'stocksActuales', // ← traemos el stock actual
        // 'movimientosStock',   // ← si además quieres los movimientos
      ],
    });
  }

  // findOne(id: number): Promise<Producto> {
  //   return this.repo.findOne({
  //     where: { id },
  //     relations: [
  //       'unidad',
  //       'tipoProducto',
  //       'stocksActuales',        // ← aquí también
  //       // 'movimientosStock',
  //     ],
  //   });
  // }

  // findAll(): Promise<Producto[]> {
  //   return this.repo.find();
  // }

  async findOne(id: number): Promise<Producto> {
    const prod = await this.repo.findOne({
      where: { id },
      relations: [
        'unidad',
        'tipoProducto',
        'stocksActuales', // ← aquí también
        // 'movimientosStock',
      ],
    });
    if (!prod) throw new NotFoundException(`Producto ${id} no encontrado`);
    return prod;
  }

  async create(dto: CreateProductoDto): Promise<Producto> {
    // normalización del nombre (como ya tenías)
    if (dto.nombre) {
      const trimmed = dto.nombre.trimStart();
      dto.nombre =
        trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
    }

    const almacenIdDefault = dto.almacenId ?? 1;
    const stockInicial = dto.stock_inicial ?? 0;

    return this.dataSource.transaction(async (m) => {
      // 1) Crear y guardar el producto
      const prod = m.getRepository(Producto).create(dto);
      const saved = await m.getRepository(Producto).save(prod);

      // 2) Crear/actualizar stock_actual (PK compuesta: producto_id + almacen_id)
      //    Usamos upsert para evitar errores si ya existe.
      await m.getRepository(StockActual).upsert(
        {
          producto_id: saved.id,
          almacen_id: almacenIdDefault,
          cantidad: stockInicial,
        },
        ['producto_id', 'almacen_id'], // conflict target
      );

      // 3) Recargar con relaciones para devolver el mismo payload que GET
      const producto = await m.getRepository(Producto).findOne({
        where: { id: saved.id },
        relations: [
          'unidad',
          'tipoProducto',
          // 'stocksActuales',  // si querés devolver también el/los stocks
          // otras relaciones si corresponde
        ],
      });
      if (!producto)
        throw new NotFoundException(`Producto ${saved.id} no encontrado`);

      return producto;
    });
  }

  async update(
    id: number,
    dto: UpdateProductoDto,
  ): Promise<{ success: true; id: number }> {
    await this.repo.update(id, dto as any);

    return {
      success: true,
      id,
    };
  }

  async remove(id: number): Promise<void> {
    const res = await this.repo.delete(id);
    if (res.affected === 0)
      throw new NotFoundException(`Producto ${id} no encontrado`);
  }

  async normalizarNombresProductos(): Promise<void> {
    const productos = await this.repo.find();

    for (const prod of productos) {
      if (prod.nombre) {
        const trimmed = prod.nombre.trimStart();
        const normalizado =
          trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();

        // Solo actualiza si hay un cambio real
        if (prod.nombre !== normalizado) {
          prod.nombre = normalizado;
          await this.repo.save(prod); // Guarda los cambios
        }
      }
    }

    console.log(
      `Se normalizaron los nombres de ${productos.length} productos (cuando aplicaba).`,
    );
  }
}