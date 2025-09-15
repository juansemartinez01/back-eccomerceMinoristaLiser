import { MovimientoStock } from 'src/movimiento-stock/movimiento-stock.entity';
import { StockActual } from 'src/stock-actual/stock-actual.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('almacen')
export class Almacen {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 255, nullable: true })
  ubicacion?: string;

  @Column({ type: 'int', nullable: true })
  capacidad?: number;

  // Movimientos donde este almacén es el origen
  @OneToMany(() => MovimientoStock, ms => ms.almacenOrigen)
  movimientosOrigen: MovimientoStock[];

  // Movimientos donde este almacén es el destino
  @OneToMany(() => MovimientoStock, ms => ms.almacenDestino)
  movimientosDestino: MovimientoStock[];

  // Stock actual en este almacén
  @OneToMany(() => StockActual, sa => sa.almacen)
  stocksActuales: StockActual[];
}