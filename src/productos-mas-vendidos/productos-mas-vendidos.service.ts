import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductosMasVendidos } from './productos-mas-vendidos.entity';
import { CreateProductosMasVendidosDto } from './dto/create-productos-mas-vendidos.dto';
import { UpdateProductosMasVendidosDto } from './dto/update-productos-mas-vendidos.dto';

@Injectable()
export class ProductosMasVendidosService {
  constructor(
    @InjectRepository(ProductosMasVendidos)
    private readonly repo: Repository<ProductosMasVendidos>,
  ) {}

  findAll(): Promise<ProductosMasVendidos[]> {
    return this.repo.find();
  }

  async findOne(productoId: number): Promise<ProductosMasVendidos> {
    const entity = await this.repo.findOne({ where: { productoId } });
    if (!entity) throw new NotFoundException(`ProductoMasVendidos para producto ${productoId} no encontrado`);
    return entity;
  }

  create(dto: CreateProductosMasVendidosDto): Promise<ProductosMasVendidos> {
    const entity = this.repo.create(dto as any);
    return this.repo.save(entity).then(savedEntity => Array.isArray(savedEntity) ? savedEntity[0] : savedEntity);
  }

  async update(productoId: number, dto: UpdateProductosMasVendidosDto): Promise<ProductosMasVendidos> {
    await this.repo.update({ productoId }, dto as any);
    return this.findOne(productoId);
  }

  async remove(productoId: number): Promise<void> {
    const res = await this.repo.delete({ productoId });
    if (res.affected === 0) throw new NotFoundException(`ProductoMasVendidos para producto ${productoId} no encontrado`);
  }
}