import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { TicketArmadoService } from './ticket-armado.service';
import { CreateTicketArmadoDto } from './dto/create-ticket-armado.dto';
import { UpdateTicketArmadoDto } from './dto/update-ticket-armado.dto';
import { TicketArmado } from './ticket-armado.entity';

@Controller('tickets-armado')
export class TicketArmadoController {
  constructor(private readonly service: TicketArmadoService) {}

  @Get()
  getAll(): Promise<TicketArmado[]> {
    return this.service.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string): Promise<TicketArmado> {
    return this.service.findOne(+id);
  }

  @Post()
  create(@Body() dto: CreateTicketArmadoDto): Promise<TicketArmado> {
    return this.service.create(dto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateTicketArmadoDto,
  ): Promise<TicketArmado> {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(+id);
  }
}
