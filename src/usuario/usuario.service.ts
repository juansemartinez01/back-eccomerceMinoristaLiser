import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Usuario } from './usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import * as bcrypt from 'bcrypt';
import { UsuarioRol } from 'src/usuario-rol/usuario-rol.entity';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly repo: Repository<Usuario>,
    private readonly dataSource: DataSource, // Inyectamos DataSource para usar el repositorio de UsuarioRol
  ) {}

  

  // For authentication: find by username and include roles
  async findByUsername(usuario: string): Promise<Usuario | null> {
  const normalizado = usuario.trim().toUpperCase().replace(/\s+/g, '');

  return this.repo
    .createQueryBuilder('usuario')
    .leftJoinAndSelect('usuario.roles', 'roles')
    .leftJoinAndSelect('roles.rol', 'rol')
    .leftJoinAndSelect('usuario.cliente', 'cliente')
    .where("REPLACE(UPPER(usuario.usuario), ' ', '') = :normalizado", { normalizado })
    .getOne();
}

  findAll(): Promise<Usuario[]> {
    return this.repo.find({ relations: ['roles', 'roles.rol','cliente'] });
  }

  async findOne(id: number): Promise<Usuario> {
    const user = await this.repo.findOne({
      where: { id },
      relations: ['roles', 'roles.rol','cliente'],
    });
    if (!user) throw new NotFoundException(`Usuario ${id} no encontrado`);
    return user;
  }

  async create(dto: CreateUsuarioDto): Promise<Usuario> {
  const user = new Usuario();
  user.nombre = dto.nombre;
  user.usuario = dto.usuario;
  user.email = dto.email !== undefined ? dto.email : "Email no registrado";
  user.clave_hash = await bcrypt.hash(dto.password, 10);

  // Guardar usuario sin roles
  const savedUser = await this.repo.save(user);

  // Si vienen roles en el dto, crear UsuarioRol[]
  if (dto.roles && dto.roles.length > 0) {
    const rolesUsuario: UsuarioRol[] = dto.roles.map(rolId => {
      const usuarioRol = new UsuarioRol();
      usuarioRol.usuario = savedUser;
      usuarioRol.rol = { id: rolId } as any; // asignamos solo el id del rol
      return usuarioRol;
    });

    await this.dataSource.getRepository(UsuarioRol).save(rolesUsuario);
  }

  return savedUser;
}


  async update(id: number, dto: UpdateUsuarioDto): Promise<Usuario> {
  const user = await this.repo.findOne({
    where: { id },
    relations: ['roles'], // para poder actualizar roles si es ManyToMany
  });

  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  if (dto.nombre !== undefined) {
    user.nombre = dto.nombre;
  }

  if (dto.usuario !== undefined) {
    user.usuario = dto.usuario;
  }

  if (dto.email !== undefined) {
    user.email = dto.email;
  }

  if (dto.password !== undefined) {
    user.clave_hash = await bcrypt.hash(dto.password, 10);
  }

  if (dto.clienteId !== undefined) {
    user.clienteId = dto.clienteId;
  }

  if (dto.activo !== undefined) {
    user.activo = dto.activo;
  }

  if (dto.ultimoLogin !== undefined) {
    user.ultimoLogin = dto.ultimoLogin;
  }

  if (dto.ultimaCompra !== undefined) {
    user.ultimaCompra = dto.ultimaCompra;
  }

  // ⚠️ Actualización de roles (si tenés relación ManyToMany)
  // if (dto.roles !== undefined) {
  //   const roles = await this.dataSource.findById(dto.roles); // rolRepo debe estar inyectado
  //   user.roles = roles;
  // }

  return this.repo.save(user);
}




  async remove(id: number): Promise<void> {
    const res = await this.repo.delete(id);
    if (res.affected === 0) throw new NotFoundException(`Usuario ${id} no encontrado`);
  }
}