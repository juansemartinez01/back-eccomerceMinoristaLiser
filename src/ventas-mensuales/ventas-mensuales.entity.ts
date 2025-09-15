import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('ventas_mensuales')
export class VentasMensuales {
  @PrimaryColumn({ type: 'date' })
  mes: string;

  @Column('decimal', { name: 'total_ventas', precision: 14, scale: 2 })
  total_ventas: number;

  @Column('int', { name: 'cantidad_facturas' })
  cantidad_facturas: number;
}
