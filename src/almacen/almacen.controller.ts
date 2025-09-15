import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { AlmacenService } from './almacen.service';
import { CreateAlmacenDto } from './dto/create-almacen.dto';
import { UpdateAlmacenDto } from './dto/update-almacen.dto';
import { Almacen } from './almacen.entity';

@Controller('almacenes')
export class AlmacenController {
  constructor(private readonly service: AlmacenService) {}

  @Get()
  getAll(): Promise<Almacen[]> {
    return this.service.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string): Promise<Almacen> {
    return this.service.findOne(+id);
  }

  @Post()
  create(@Body() dto: CreateAlmacenDto): Promise<Almacen> {
    return this.service.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAlmacenDto): Promise<Almacen> {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(+id);
  }
}
