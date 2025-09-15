import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { ListaPrecios } from '../lista-precios/lista-precios.entity';
import { Producto } from '../producto/producto.entity';

@Entity('precios_del_dia')
export class PrecioDelDia {
  @PrimaryColumn({ name: 'lista_id', type: 'int' })
  listaId: number;

  @ManyToOne(() => ListaPrecios, { eager: true })
  @JoinColumn({ name: 'lista_id' })
  lista: ListaPrecios;

  @PrimaryColumn({ name: 'producto_id', type: 'int' })
  productoId: number;

  @ManyToOne(() => Producto, { eager: true })
  @JoinColumn({ name: 'producto_id' })
  producto: Producto;

  @PrimaryColumn({ type: 'date' })
  fecha: string;

  @Column('decimal', { name: 'precio_unitario', precision: 12, scale: 2 })
  precioUnitario: number;
}