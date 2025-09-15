import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PrecioDelDia } from './precio-del-dia.entity';
import { CreatePrecioDelDiaDto } from './dto/create-precio-del-dia.dto';
import { UpdatePrecioDelDiaDto } from './dto/update-precio-del-dia.dto';

@Injectable()
export class PrecioDelDiaService {
  constructor(
    @InjectRepository(PrecioDelDia)
    private readonly repo: Repository<PrecioDelDia>,
  ) {}

  findAll(): Promise<PrecioDelDia[]> {
    return this.repo.find();
  }

  async findOne(listaId: number, productoId: number, fecha: string): Promise<PrecioDelDia> {
    const entity = await this.repo.findOneBy({ listaId, productoId, fecha });
    if (!entity) throw new NotFoundException(`Precio del día no encontrado para lista ${listaId}, producto ${productoId} en ${fecha}`);
    return entity;
  }

  create(dto: CreatePrecioDelDiaDto): Promise<PrecioDelDia> {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  async update(listaId: number, productoId: number, fecha: string, dto: UpdatePrecioDelDiaDto): Promise<PrecioDelDia> {
    await this.repo.update({ listaId, productoId, fecha }, dto as any);
    return this.findOne(listaId, productoId, fecha);
  }

  async remove(listaId: number, productoId: number, fecha: string): Promise<void> {
    const res = await this.repo.delete({ listaId, productoId, fecha });
    if (res.affected === 0)
      throw new NotFoundException(`Precio del día no encontrado para lista ${listaId}, producto ${productoId} en ${fecha}`);
  }
}