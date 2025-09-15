import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoProducto } from './tipo-producto.entity';
import { CreateTipoProductoDto } from './dto/create-tipo-producto.dto';
import { UpdateTipoProductoDto } from './dto/update-tipo-producto.dto';

@Injectable()
export class TipoProductoService {
  constructor(
    @InjectRepository(TipoProducto)
    private readonly repo: Repository<TipoProducto>,
  ) {}

  findAll(): Promise<TipoProducto[]> {
    return this.repo.find();
  }

  async findOne(id: number): Promise<TipoProducto> {
    const tipo = await this.repo.findOneBy({ id });
    if (!tipo) throw new NotFoundException(`TipoProducto ${id} no encontrado`);
    return tipo;
  }

  create(dto: CreateTipoProductoDto): Promise<TipoProducto> {
    const tipo = this.repo.create(dto);
    return this.repo.save(tipo);
  }

  async update(id: number, dto: UpdateTipoProductoDto): Promise<TipoProducto> {
    await this.repo.update(id, dto as any);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const res = await this.repo.delete(id);
    if (res.affected === 0) throw new NotFoundException(`TipoProducto ${id} no encontrado`);
  }
}