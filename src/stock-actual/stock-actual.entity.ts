import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Producto } from '../producto/producto.entity';
import { Almacen } from '../almacen/almacen.entity';

@Entity('stock_actual')
export class StockActual {
  @PrimaryColumn({ name: 'producto_id', type: 'int' })
  producto_id: number;

  @PrimaryColumn({ name: 'almacen_id', type: 'int' })
  almacen_id: number;

  @ManyToOne(() => Producto, p => p.stocksActuales, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'producto_id' })
  producto: Producto;

  @ManyToOne(() => Almacen, a => a.stocksActuales, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'almacen_id' })
  almacen: Almacen;

  @Column({ type: 'int' })
  cantidad: number;

  @UpdateDateColumn({ name: 'last_updated' })
  last_updated: Date;
}
