import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Pedido } from '../pedido/pedido.entity';
import { Producto } from '../producto/producto.entity';

@Entity('items_pedido')
export class ItemPedido {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'pedido_id', type: 'int' })
  pedidoId: number;

  @ManyToOne(() => Pedido, { eager: true })
  @JoinColumn({ name: 'pedido_id' })
  pedido: Pedido;

  @Column({ name: 'producto_id', type: 'int' })
  productoId: number;

  @ManyToOne(() => Producto, { eager: true })
  @JoinColumn({ name: 'producto_id' })
  producto: Producto;

  @Column('int')
  cantidad: number;

  @Column('decimal', { precision: 12, scale: 2 })
  precio_unitario: number;

  @Column({ type: 'text', nullable: true })
  comentario?: string;

}
