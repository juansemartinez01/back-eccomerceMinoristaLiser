import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VentasMensuales } from './ventas-mensuales.entity';
import { CreateVentasMensualesDto } from './dto/create-ventas-mensuales.dto';
import { UpdateVentasMensualesDto } from './dto/update-ventas-mensuales.dto';

@Injectable()
export class VentasMensualesService {
  constructor(
    @InjectRepository(VentasMensuales)
    private readonly repo: Repository<VentasMensuales>,
  ) {}

  findAll(): Promise<VentasMensuales[]> {
    return this.repo.find();
  }

  async findOne(mes: string): Promise<VentasMensuales> {
    const vm = await this.repo.findOneBy({ mes });
    if (!vm) throw new NotFoundException(`VentasMensuales para mes ${mes} no encontrado`);
    return vm;
  }

  create(dto: CreateVentasMensualesDto): Promise<VentasMensuales> {
    const vm = this.repo.create(dto);
    return this.repo.save(vm);
  }

  async update(mes: string, dto: UpdateVentasMensualesDto): Promise<VentasMensuales> {
    await this.repo.update({ mes }, dto as any);
    return this.findOne(mes);
  }

  async remove(mes: string): Promise<void> {
    const res = await this.repo.delete({ mes });
    if (res.affected === 0) throw new NotFoundException(`VentasMensuales para mes ${mes} no encontrado`);
  }
}