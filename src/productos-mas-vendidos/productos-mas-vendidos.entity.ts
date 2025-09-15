import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Producto } from '../producto/producto.entity';

@Entity('productos_mas_vendidos')
export class ProductosMasVendidos {
  @PrimaryColumn({ name: 'producto_id', type: 'int' })
  productoId: number;

  @ManyToOne(() => Producto, { eager: true })
  @JoinColumn({ name: 'producto_id' })
  producto: Producto;

  @Column({ length: 255 })
  nombre: string;

  @Column('int', { name: 'cantidad_total' })
  cantidad_total: number;

  @Column('decimal', { name: 'ingresos_generados', precision: 14, scale: 2 })
  ingresos_generados: number;
}