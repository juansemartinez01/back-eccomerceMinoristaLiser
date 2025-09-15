import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, UpdateDateColumn } from 'typeorm';
import { Producto } from '../producto/producto.entity';

@Entity('stock')
export class Stock {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'producto_id', type: 'int' })
  productoId: number;

  @ManyToOne(() => Producto)
  @JoinColumn({ name: 'producto_id' })
  producto: Producto;

  @Column('int', { name: 'cantidad_disponible' })
  cantidad_disponible: number;

  @UpdateDateColumn({ name: 'ultima_actualizacion' })
  ultima_actualizacion: Date;
}
