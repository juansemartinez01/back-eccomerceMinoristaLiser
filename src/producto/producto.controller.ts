import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { Producto } from './producto.entity';

@Controller('productos')
export class ProductoController {
  constructor(private readonly service: ProductoService) {}

  @Get()
  getAll(): Promise<Producto[]> {
    return this.service.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string): Promise<Producto> {
    return this.service.findOne(+id);
  }

  @Post()
  create(@Body() dto: CreateProductoDto): Promise<Producto> {
    return this.service.create(dto);
  }

  @Put(':id')
update(
  @Param('id') id: string,
  @Body() dto: UpdateProductoDto
): Promise<{ success: true; id: number }> {
  return this.service.update(+id, dto);
}

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(+id);
  }
}