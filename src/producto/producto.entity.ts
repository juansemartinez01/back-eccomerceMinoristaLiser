import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Unidad } from '../unidad/unidad.entity';
import { TipoProducto } from '../tipo-producto/tipo-producto.entity';
import { PrecioProductoLista } from 'src/precio-producto-lista/precio-producto-lista.entity';
import { MovimientoStock } from 'src/movimiento-stock/movimiento-stock.entity';
import { StockActual } from 'src/stock-actual/stock-actual.entity';

@Entity('productos')
export class Producto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  nombre: string;

  @Column('decimal', { precision: 12, scale: 2 })
  precio_base: number;

  @Column({ name: 'unidad_id', type: 'int' })
  unidadId: number;

  @ManyToOne(() => Unidad, { eager: true })
  @JoinColumn({ name: 'unidad_id' })
  unidad: Unidad;

  @Column({ name: 'tipo_producto_id', type: 'int' })
  tipoProductoId: number;

  @ManyToOne(() => TipoProducto, { eager: true })
  @JoinColumn({ name: 'tipo_producto_id' })
  tipoProducto: TipoProducto;

  @Column({ type: 'text', nullable: true })
  descripcion?: string;

  @Column({ default: false })
  vacio: boolean;

  @Column({ default: false })
  oferta: boolean;

  @Column('decimal', { precision: 12, scale: 2, nullable: true })
  precio_oferta?: number;

  @Column({ default: true })
  activo: boolean;

  @Column({ length: 500, nullable: true })
  imagen?: string;

  @Column({ name: 'precio_vacio', type: 'numeric', precision: 12, scale: 2, default: 0 })
  precioVacio: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @Column({ name: 'id_interno', length: 100, unique: false })
  id_interno: string;

  @OneToMany(() => PrecioProductoLista, ppl => ppl.producto)
  preciosEnListas?: PrecioProductoLista[];

  // —— Relación al stock actual ——
  @OneToMany(() => StockActual, sa => sa.producto, { cascade: true })
  stocksActuales: StockActual[];

  // —— Relación a movimientos de stock ——
  @OneToMany(() => MovimientoStock, ms => ms.producto, { cascade: true })
  movimientosStock: MovimientoStock[];

  @Column({ type: 'varchar', length: 255, nullable: true })
  empresa?: string;
}