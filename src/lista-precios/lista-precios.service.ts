import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ListaPrecios } from './lista-precios.entity';
import { CreateListaPreciosDto } from './dto/create-lista-precios.dto';
import { UpdateListaPreciosDto } from './dto/update-lista-precios.dto';
import { Producto } from 'src/producto/producto.entity';
import { PrecioProductoLista } from 'src/precio-producto-lista/precio-producto-lista.entity';

// Tipo que devolverá el endpoint
type ProductoConPrecio = Omit<Producto, 'preciosEnListas' | 'movimientosStock'> & {
  precio_unitario: string;
};

@Injectable()
export class ListaPreciosService {
  constructor(
    @InjectRepository(ListaPrecios)
    private readonly repo: Repository<ListaPrecios>,

    @InjectRepository(PrecioProductoLista)
    private readonly pplRepo: Repository<PrecioProductoLista>,
  ) {}

  findAll(): Promise<ListaPrecios[]> {
    return this.repo.find();
  }

  async findOne(id: number): Promise<ListaPrecios> {
    const lista = await this.repo.findOneBy({ id });
    if (!lista) throw new NotFoundException(`ListaPrecios ${id} no encontrada`);
    return lista;
  }

  create(dto: CreateListaPreciosDto): Promise<ListaPrecios> {
    const lista = this.repo.create(dto);
    return this.repo.save(lista);
  }

  async update(id: number, dto: UpdateListaPreciosDto): Promise<ListaPrecios> {
    await this.repo.update(id, dto as any);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const res = await this.repo.delete(id);
    if (res.affected === 0) throw new NotFoundException(`ListaPrecios ${id} no encontrada`);
  }

  async getProductosByListaId(listaId: number): Promise<ProductoConPrecio[]> {
  const registros = await this.pplRepo.find({
    where: { lista: { id: listaId } },
    relations: [
      'producto',
      'producto.unidad',
      'producto.tipoProducto',
      'producto.stocksActuales',
      'producto.movimientosStock',
    ],
    order: {
      producto: {
        nombre: 'ASC', // asumimos que querés ordenar por nombre
      },
    },
  });
    if (!registros.length) {
      throw new NotFoundException(`La lista de precios ${listaId} no existe o está vacía.`);
    }

    return registros.map(r => ({
      // Campos de Producto
      id:            r.producto.id,
      nombre:        r.producto.nombre,
      precio_base:   r.producto.precio_base,
      unidadId:      r.producto.unidadId,
      unidad:        r.producto.unidad,
      tipoProductoId:r.producto.tipoProductoId,
      tipoProducto:  r.producto.tipoProducto,
      descripcion:   r.producto.descripcion,
      vacio:         r.producto.vacio,
      //oferta:        r.producto.oferta,
      //precio_oferta: r.producto.precio_oferta,
      activo:        r.producto.activo,
      imagen:        r.producto.imagen,
      precioVacio:   r.producto.precioVacio,
      created_at:    r.producto.created_at,
      updated_at:    r.producto.updated_at,
      id_interno:    r.producto.id_interno,
      stocksActuales: r.producto.stocksActuales,
      

      // Campo extra: precio en la lista
      precio_unitario: r.precioUnitario.toString(),
      oferta: r.oferta,
      precio_oferta: r.precioOferta
    }));
  }
}