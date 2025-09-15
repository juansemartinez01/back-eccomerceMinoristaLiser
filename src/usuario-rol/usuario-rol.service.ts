import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsuarioRol } from './usuario-rol.entity';
import { CreateUsuarioRolDto } from './dto/create-usuario-rol.dto';
import { UpdateUsuarioRolDto } from './dto/update-usuario-rol.dto';

@Injectable()
export class UsuarioRolService {
  constructor(
    @InjectRepository(UsuarioRol)
    private readonly repo: Repository<UsuarioRol>,
  ) {}

  findAll(): Promise<UsuarioRol[]> {
    return this.repo.find();
  }

  async findOne(id: number): Promise<UsuarioRol> {
    const ur = await this.repo.findOneBy({ id });
    if (!ur) throw new NotFoundException(`UsuarioRol ${id} no encontrado`);
    return ur;
  }

  create(dto: CreateUsuarioRolDto): Promise<UsuarioRol> {
    const ur = this.repo.create({
      usuarioId: dto.usuarioId,
      rolId: dto.rolId,
    });
    return this.repo.save(ur);
  }

  async update(id: number, dto: UpdateUsuarioRolDto): Promise<UsuarioRol> {
    await this.repo.update(id, dto as any);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const res = await this.repo.delete(id);
    if (res.affected === 0)
      throw new NotFoundException(`UsuarioRol ${id} no encontrado`);
  }

  async removeByUsuarioAndRol(usuarioId: number, rolId: number): Promise<void> {
    const usuarioRol = await this.repo.findOne({
      where: { usuarioId, rolId },
    });

    if (!usuarioRol) {
      throw new NotFoundException(`La relación usuario ${usuarioId} con rol ${rolId} no existe`);
    }

    await this.repo.remove(usuarioRol);
  }
}