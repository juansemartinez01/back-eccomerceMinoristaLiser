import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MovimientoStock } from './movimiento-stock.entity';
import { CreateMovimientoStockDto } from './dto/create-movimiento-stock.dto';
import { UpdateMovimientoStockDto } from './dto/update-movimiento-stock.dto';

@Injectable()
export class MovimientoStockService {
  constructor(
    @InjectRepository(MovimientoStock)
    private readonly repo: Repository<MovimientoStock>,
  ) {}

  findAll(): Promise<MovimientoStock[]> {
    return this.repo.find({ relations: ['producto', 'almacenOrigen', 'almacenDestino'] });
  }

  async findOne(id: number): Promise<MovimientoStock> {
    const mov = await this.repo.findOne({
      where: { id },
      relations: ['producto', 'almacenOrigen', 'almacenDestino'],
    });
    if (!mov) throw new NotFoundException(`Movimiento ${id} no encontrado`);
    return mov;
  }

  create(dto: CreateMovimientoStockDto): Promise<MovimientoStock> {
    const mov = this.repo.create(dto);
    return this.repo.save(mov);
  }

  async update(id: number, dto: UpdateMovimientoStockDto): Promise<MovimientoStock> {
    await this.repo.update(id, dto as any);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const res = await this.repo.delete(id);
    if (res.affected === 0) throw new NotFoundException(`Movimiento ${id} no encontrado`);
  }
}