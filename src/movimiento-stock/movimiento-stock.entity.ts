import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Producto } from '../producto/producto.entity';
import { Almacen } from '../almacen/almacen.entity';

@Entity('movimiento_stock')
export class MovimientoStock {
  @PrimaryGeneratedColumn()
  id: number;

  

  @ManyToOne(() => Producto)
  @JoinColumn({ name: 'producto_id' })
  producto: Producto;

  

  @ManyToOne(() => Almacen)
  @JoinColumn({ name: 'origen_almacen' })
  almacenOrigen?: Almacen;

  

  @ManyToOne(() => Almacen)
  @JoinColumn({ name: 'destino_almacen' })
  almacenDestino?: Almacen;

  @Column({ type: 'int' })
  cantidad: number;

  @Column({ length: 20 })
  tipo: 'entrada' | 'salida' | 'traspaso';

  @CreateDateColumn({ name: 'fecha' })
  fecha: Date;

  @Column({ name: 'usuario_id', type: 'int', nullable: true })
  usuario_id?: number;

  @Column({ type: 'text', nullable: true })
  motivo?: string;
}