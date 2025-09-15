import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stock } from './stock.entity';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(Stock)
    private readonly repo: Repository<Stock>,
  ) {}

  findAll(): Promise<Stock[]> {
    return this.repo.find({ relations: ['producto'] });
  }

  async findOne(id: number): Promise<Stock> {
    const entity = await this.repo.findOne({ where: { id }, relations: ['producto'] });
    if (!entity) throw new NotFoundException(`Stock ${id} no encontrado`);
    return entity;
  }

  create(dto: CreateStockDto): Promise<Stock> {
    const stock = this.repo.create(dto);
    return this.repo.save(stock);
  }

  async update(id: number, dto: UpdateStockDto): Promise<Stock> {
    await this.repo.update(id, dto as any);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const res = await this.repo.delete(id);
    if (res.affected === 0) throw new NotFoundException(`Stock ${id} no encontrado`);
  }
}