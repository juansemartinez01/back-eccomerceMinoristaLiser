import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { MovimientoCuentaCorrienteService } from './movimiento-cuenta-corriente.service';
import { CreateMovimientoCuentaCorrienteDto } from './dto/create-movimiento-cuenta-corriente.dto';
import { UpdateMovimientoCuentaCorrienteDto } from './dto/update-movimiento-cuenta-corriente.dto';
import { MovimientoCuentaCorriente } from './movimiento-cuenta-corriente.entity';

@Controller('movimientos-cuenta-corriente')
export class MovimientoCuentaCorrienteController {
  constructor(private readonly service: MovimientoCuentaCorrienteService) {}

  @Get()
  getAll(): Promise<MovimientoCuentaCorriente[]> {
    return this.service.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string): Promise<MovimientoCuentaCorriente> {
    return this.service.findOne(+id);
  }

  @Post()
  create(@Body() dto: CreateMovimientoCuentaCorrienteDto): Promise<MovimientoCuentaCorriente> {
    return this.service.create(dto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateMovimientoCuentaCorrienteDto,
  ): Promise<MovimientoCuentaCorriente> {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(+id);
  }
}