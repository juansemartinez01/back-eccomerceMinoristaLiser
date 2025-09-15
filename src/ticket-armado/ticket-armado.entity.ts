import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Pedido } from '../pedido/pedido.entity';
import { Usuario } from '../usuario/usuario.entity';

@Entity('tickets_armado')
export class TicketArmado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'pedido_id', type: 'int' })
  pedidoId: number;

  @ManyToOne(() => Pedido, { eager: true })
  @JoinColumn({ name: 'pedido_id' })
  pedido: Pedido;

  @Column({ name: 'usuario_id', type: 'int' })
  usuarioId: number;

  @ManyToOne(() => Usuario, { eager: true })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @CreateDateColumn({ name: 'hora_generacion' })
  horaGeneracion: Date;

  @Column({ type: 'text', nullable: true })
  observaciones?: string;
}