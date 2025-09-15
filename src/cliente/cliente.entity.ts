import { ListaPrecios } from 'src/lista-precios/lista-precios.entity';
import { Usuario } from 'src/usuario/usuario.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity('clientes')
export class Cliente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  nombre: string;

  @Column({ length: 50 })
  telefono: string;

  @Column({ length: 500 })
  direccion: string;

  @Column({ length: 50 })
  tipo: string;

  @Column('decimal', { precision: 12, scale: 2 })
  descuento: number;

  @Column('decimal', { precision: 14, scale: 2 })
  saldo_cuenta_corriente: number;

  // ─── Relación con ListaPrecios ───
  @Column({ name: 'lista_precios_id', type: 'int', nullable: true })
  listaPreciosId?: number;

  @ManyToOne(() => ListaPrecios, lp => lp.clientes, { nullable: true })
  @JoinColumn({ name: 'lista_precios_id' })
  listaPrecios?: ListaPrecios;
  // ──────────────────────────────────

  // ── Relación inversa: usuarios de este cliente ──
  @OneToMany(() => Usuario, u => u.cliente)
  usuarios: Usuario[];
  // ────────────────────────────────────────────────
}