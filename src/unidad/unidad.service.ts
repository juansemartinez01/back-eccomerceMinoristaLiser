import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Unidad } from './unidad.entity';
import { CreateUnidadDto } from './dto/create-unidad.dto';
import { UpdateUnidadDto } from './dto/update-unidad.dto';

@Injectable()
export class UnidadService {
  constructor(
    @InjectRepository(Unidad)
    private readonly repo: Repository<Unidad>,
  ) {}

  findAll(): Promise<Unidad[]> {
    return this.repo.find();
  }

  async findOne(id: number): Promise<Unidad> {
    const unidad = await this.repo.findOneBy({ id });
    if (!unidad) throw new NotFoundException(`Unidad ${id} no encontrada`);
    return unidad;
  }

  create(dto: CreateUnidadDto): Promise<Unidad> {
    const unidad = this.repo.create(dto);
    return this.repo.save(unidad);
  }

  async update(id: number, dto: UpdateUnidadDto): Promise<Unidad> {
    await this.repo.update(id, dto as any);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const res = await this.repo.delete(id);
    if (res.affected === 0) throw new NotFoundException(`Unidad ${id} no encontrada`);
  }
}