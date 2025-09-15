import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('tipo_producto')
export class TipoProducto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, unique: true })
  nombre: string;
}