import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { UnidadService } from './unidad.service';
import { CreateUnidadDto } from './dto/create-unidad.dto';
import { UpdateUnidadDto } from './dto/update-unidad.dto';
import { Unidad } from './unidad.entity';

@Controller('unidad')
export class UnidadController {
  constructor(private readonly service: UnidadService) {}

  @Get()
  getAll(): Promise<Unidad[]> {
    return this.service.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string): Promise<Unidad> {
    return this.service.findOne(+id);
  }

  @Post()
  create(@Body() dto: CreateUnidadDto): Promise<Unidad> {
    return this.service.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUnidadDto): Promise<Unidad> {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(+id);
  }
}