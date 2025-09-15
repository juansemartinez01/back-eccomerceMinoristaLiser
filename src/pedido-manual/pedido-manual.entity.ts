import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Cliente } from '../cliente/cliente.entity';
import { Usuario } from '../usuario/usuario.entity';
import { Pedido } from '../pedido/pedido.entity';

@Entity('pedidos_manuales')
export class PedidoManual {
  @PrimaryGeneratedColumn()
  id: number;

  

  @ManyToOne(() => Cliente, { eager: true })
  @JoinColumn({ name: 'cliente_id' })
  cliente: Cliente;

  

  @ManyToOne(() => Usuario, { eager: true })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @Column({ name: 'mensaje_original', type: 'text' })
  mensajeOriginal: string;

  @Column({ name: 'fecha_carga', type: 'timestamp' })
  fechaCarga: Date;

  

  @ManyToOne(() => Pedido, { eager: true, nullable: true })
  @JoinColumn({ name: 'pedido_id' })
  pedido?: Pedido;

  @Column({ name: 'nombre_cliente', type: 'varchar', nullable: true })
  nombreCliente?: string;

}