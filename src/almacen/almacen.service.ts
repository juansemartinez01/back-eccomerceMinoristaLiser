import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Almacen } from './almacen.entity';
import { CreateAlmacenDto } from './dto/create-almacen.dto';
import { UpdateAlmacenDto } from './dto/update-almacen.dto';

@Injectable()
export class AlmacenService {
  constructor(
    @InjectRepository(Almacen)
    private readonly repo: Repository<Almacen>,
  ) {}

  findAll(): Promise<Almacen[]> {
    return this.repo.find();
  }

  async findOne(id: number): Promise<Almacen> {
    const alm = await this.repo.findOneBy({ id });
    if (!alm) throw new NotFoundException(`Almacén ${id} no encontrado`);
    return alm;
  }

  create(dto: CreateAlmacenDto): Promise<Almacen> {
    const alm = this.repo.create(dto);
    return this.repo.save(alm);
  }

  async update(id: number, dto: UpdateAlmacenDto): Promise<Almacen> {
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const res = await this.repo.delete(id);
    if (res.affected === 0) throw new NotFoundException(`Almacén ${id} no encontrado`);
  }
}