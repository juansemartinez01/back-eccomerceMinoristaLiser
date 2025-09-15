import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Pedido } from '../pedido/pedido.entity';

@Entity('facturas')
export class Factura {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'pedido_id', type: 'int' })
  pedidoId: number;

  @ManyToOne(() => Pedido, { eager: true })
  @JoinColumn({ name: 'pedido_id' })
  pedido: Pedido;

  @Column('decimal', { precision: 14, scale: 2 })
  total: number;

  @Column({ name: 'fecha_pago', type: 'timestamp' })
  fechaPago: Date;

  @Column({ name: 'forma_pago', length: 50 })
  formaPago: string;

  @Column({ type: 'boolean' })
  legal: boolean;
}
