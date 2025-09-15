import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ListaPrecios } from '../lista-precios/lista-precios.entity';
import { Producto } from '../producto/producto.entity';

@Entity('precio_producto_lista')
export class PrecioProductoLista {
  @PrimaryGeneratedColumn()
  id: number;

  

  @ManyToOne(() => ListaPrecios, { eager: true })
  @JoinColumn({ name: 'lista_id' })
  lista: ListaPrecios;

  

  @ManyToOne(() => Producto, { eager: true })
  @JoinColumn({ name: 'producto_id' })
  producto: Producto;

  @Column('decimal', { name: 'precio_unitario', precision: 12, scale: 2 })
  precioUnitario: number;

  @Column({ default: false })
  oferta: boolean;

  @Column('decimal', { name: 'precio_oferta', precision: 12, scale: 2, nullable: true })
  precioOferta?: number;

}