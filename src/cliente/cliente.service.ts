import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, ILike, Repository } from 'typeorm';
import { Cliente } from './cliente.entity';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { Usuario } from 'src/usuario/usuario.entity';
import { UsuarioRol } from 'src/usuario-rol/usuario-rol.entity';
import { CreateClienteUsuarioDto } from './dto/create-cliente-usuario.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ClienteService {
  constructor(
    @InjectRepository(Cliente)
    private readonly repo: Repository<Cliente>,
    private readonly dataSource: DataSource, 
  ) {}

  findAll(): Promise<Cliente[]> {
    return this.repo.find();
  }

  async findOne(id: number): Promise<Cliente> {
    const cliente = await this.repo.findOneBy({ id });
    if (!cliente) throw new NotFoundException(`Cliente ${id} no encontrado`);
    return cliente;
  }

  create(dto: CreateClienteDto): Promise<Cliente> {
    const cliente = this.repo.create(dto);
    return this.repo.save(cliente);
  }

  async update(id: number, dto: UpdateClienteDto): Promise<Cliente> {
    await this.repo.update(id, dto as any);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.repo.delete(id);
    if (result.affected === 0) throw new NotFoundException(`Cliente ${id} no encontrado`);
  }

  async buscarPorNombreOTelefono(query: string): Promise<Cliente[]> {
  return this.repo.find({
    where: [
      { nombre: ILike(`%${query}%`) },
      { telefono: ILike(`%${query}%`) }
    ],
    take: 10, // límite opcional
    order: { nombre: 'ASC' }
  });
}


async createConUsuario(
    dto: CreateClienteUsuarioDto,
  ): Promise<{ cliente: Cliente; usuario: Usuario }> {
    return this.dataSource.transaction(async (manager) => {
      /* ---------- 1. Crear Cliente ---------- */
      const cliente = manager.getRepository(Cliente).create({
        nombre: dto.nombre,
        telefono: dto.telefono,
        direccion: dto.direccion,
        tipo: dto.tipo,
        descuento: dto.descuento,
        saldo_cuenta_corriente: dto.saldo_cuenta_corriente ?? 0,
        listaPreciosId: dto.listaPreciosId,
      });
      await manager.save(cliente);

      /* ---------- 2. Crear Usuario asociado ---------- */
      const usuarioRepo = manager.getRepository(Usuario);
      const usuario = new Usuario();
      usuario.nombre = dto.nombre;
      usuario.usuario = dto.usuario;
      usuario.email = dto.email ?? 'Email no registrado';
      usuario.clave_hash = await bcrypt.hash(dto.password, 10);
      usuario.cliente = cliente;           // relación ⚡
      usuario.activo = dto.activo ?? true;
      usuario.ultimoLogin = dto.ultimoLogin;
      usuario.ultimaCompra = dto.ultimaCompra;

      await usuarioRepo.save(usuario);

      /* ---------- 3. Asignar roles ---------- */
      const usuarioRolRepo = manager.getRepository(UsuarioRol);

      // Si no vienen roles, se asigna automáticamente el rol "Cliente"
      const rolesIds = dto.roles?.length ? dto.roles : [2]; // 2 es el ID del rol "Cliente"

      const links = rolesIds.map((rolId) => {
        const ur = new UsuarioRol();
        ur.usuario = usuario;
        ur.rol = { id: rolId } as any;
        return ur;
      });

      await usuarioRolRepo.save(links);
      // 4. Devolver el cliente y usuario creados

      return { cliente, usuario };
    });
  }

}