import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MovimientoCuentaCorriente } from './movimiento-cuenta-corriente.entity';
import { CreateMovimientoCuentaCorrienteDto } from './dto/create-movimiento-cuenta-corriente.dto';
import { UpdateMovimientoCuentaCorrienteDto } from './dto/update-movimiento-cuenta-corriente.dto';

@Injectable()
export class MovimientoCuentaCorrienteService {
  constructor(
    @InjectRepository(MovimientoCuentaCorriente)
    private readonly repo: Repository<MovimientoCuentaCorriente>,
  ) {}

  findAll(): Promise<MovimientoCuentaCorriente[]> {
    return this.repo.find();
  }

  async findOne(id: number): Promise<MovimientoCuentaCorriente> {
    const mov = await this.repo.findOneBy({ id });
    if (!mov) throw new NotFoundException(`MovimientoCuentaCorriente ${id} no encontrado`);
    return mov;
  }

  create(dto: CreateMovimientoCuentaCorrienteDto): Promise<MovimientoCuentaCorriente> {
    const mov = this.repo.create({
      clienteId: dto.clienteId,
      fecha: new Date(dto.fecha),
      monto: dto.monto,
      descripcion: dto.descripcion,
      tipo_movimiento: dto.tipo_movimiento,
    });
    return this.repo.save(mov);
  }

  async update(id: number, dto: UpdateMovimientoCuentaCorrienteDto): Promise<MovimientoCuentaCorriente> {
    await this.repo.update(id, dto as any);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const res = await this.repo.delete(id);
    if (res.affected === 0) throw new NotFoundException(`MovimientoCuentaCorriente ${id} no encontrado`);
  }
}