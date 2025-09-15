import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Factura } from './factura.entity';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { UpdateFacturaDto } from './dto/update-factura.dto';

@Injectable()
export class FacturaService {
  constructor(
    @InjectRepository(Factura)
    private readonly repo: Repository<Factura>,
  ) {}

  findAll(): Promise<Factura[]> {
    return this.repo.find();
  }

  async findOne(id: number): Promise<Factura> {
    const factura = await this.repo.findOneBy({ id });
    if (!factura) throw new NotFoundException(`Factura ${id} no encontrada`);
    return factura;
  }

  create(dto: CreateFacturaDto): Promise<Factura> {
    const factura = this.repo.create(dto);
    return this.repo.save(factura);
  }

  async update(id: number, dto: UpdateFacturaDto): Promise<Factura> {
    await this.repo.update(id, dto as any);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const res = await this.repo.delete(id);
    if (res.affected === 0) throw new NotFoundException(`Factura ${id} no encontrada`);
  }
}
