import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TicketArmado } from './ticket-armado.entity';
import { CreateTicketArmadoDto } from './dto/create-ticket-armado.dto';
import { UpdateTicketArmadoDto } from './dto/update-ticket-armado.dto';

@Injectable()
export class TicketArmadoService {
  constructor(
    @InjectRepository(TicketArmado)
    private readonly repo: Repository<TicketArmado>,
  ) {}

  findAll(): Promise<TicketArmado[]> {
    return this.repo.find();
  }

  async findOne(id: number): Promise<TicketArmado> {
    const ticket = await this.repo.findOneBy({ id });
    if (!ticket) throw new NotFoundException(`TicketArmado ${id} no encontrado`);
    return ticket;
  }

  create(dto: CreateTicketArmadoDto): Promise<TicketArmado> {
    const ticket = this.repo.create(dto);
    return this.repo.save(ticket);
  }

  async update(id: number, dto: UpdateTicketArmadoDto): Promise<TicketArmado> {
    await this.repo.update(id, dto as any);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const res = await this.repo.delete(id);
    if (res.affected === 0) throw new NotFoundException(`TicketArmado ${id} no encontrado`);
  }
}
