import { Cliente } from 'src/cliente/cliente.entity';
import { PrecioProductoLista } from 'src/precio-producto-lista/precio-producto-lista.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('listas_precios')
export class ListaPrecios {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  nombre: string;

  @Column({ type: 'date' })
  fecha: string;

  @OneToMany(() => Cliente, c => c.listaPrecios)
  clientes: Cliente[];

  @OneToMany(() => PrecioProductoLista, ppl => ppl.lista)
  precios: PrecioProductoLista[];
}
