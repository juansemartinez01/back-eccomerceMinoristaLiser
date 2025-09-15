import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { TipoProductoService } from './tipo-producto.service';
import { CreateTipoProductoDto } from './dto/create-tipo-producto.dto';
import { UpdateTipoProductoDto } from './dto/update-tipo-producto.dto';
import { TipoProducto } from './tipo-producto.entity';

@Controller('tipo-producto')
export class TipoProductoController {
  constructor(private readonly service: TipoProductoService) {}

  @Get()
  getAll(): Promise<TipoProducto[]> {
    return this.service.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string): Promise<TipoProducto> {
    return this.service.findOne(+id);
  }

  @Post()
  create(@Body() dto: CreateTipoProductoDto): Promise<TipoProducto> {
    return this.service.create(dto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateTipoProductoDto,
  ): Promise<TipoProducto> {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(+id);
  }
}