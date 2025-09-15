import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Cliente } from '../cliente/cliente.entity';
import { Usuario } from '../usuario/usuario.entity';
import { ItemPedido } from 'src/item-pedido/item-pedido.entity';

@Entity('pedidos')
export class Pedido {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cliente, { eager: true })
  @JoinColumn({ name: 'cliente_id' })
  cliente: Cliente;

  @ManyToOne(() => Usuario, { eager: true })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @Column({ name: 'fecha_hora', type: 'timestamp' })
  fechaHora: Date;

  @Column({ length: 50 })
  canal: string;

  @Column({ length: 50 })
  estado: string;

  @ManyToOne(() => Usuario, { eager: true, nullable: true })
  @JoinColumn({ name: 'armador_id' })
  armador?: Usuario;

  @ManyToOne(() => Usuario, { eager: true, nullable: true })
  @JoinColumn({ name: 'entregador_id' })
  entregador?: Usuario;

  @Column({ name: 'estado_pago', length: 50 })
  estadoPago: string;

  @OneToMany(() => ItemPedido, item => item.pedido, { cascade: true })
  items: ItemPedido[];

  @Column({ type: 'text', nullable: true })
  nota?: string; // Comentarios sobre el pedido
}
