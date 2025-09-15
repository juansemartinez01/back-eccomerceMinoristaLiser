import { Cliente } from 'src/cliente/cliente.entity';
import { UsuarioRol } from 'src/usuario-rol/usuario-rol.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;// auto-incremental
  

  @Column({ length: 255 })
  nombre: string;

  @Column({ length: 100, unique: true })
  usuario: string;

  @Column({ name: 'clave_hash', length: 255 })
  clave_hash: string;

  @Column({ length: 255 })
  email: string;

  @OneToMany(() => UsuarioRol, usuarioRol => usuarioRol.usuario)
  roles: UsuarioRol[];

  @Column({ name: 'cliente_id', type: 'int', nullable: true })
  clienteId?: number;

  @ManyToOne(() => Cliente, c => c.usuarios, { nullable: true })
  @JoinColumn({ name: 'cliente_id' })
  cliente?: Cliente;

  @Column({ name: 'ultimo_login', type: 'timestamp', nullable: true })
  ultimoLogin?: Date;

  @Column({ name: 'ultima_compra', type: 'timestamp', nullable: true })
  ultimaCompra?: Date;

  @Column({ default: true })
  activo: boolean;
}