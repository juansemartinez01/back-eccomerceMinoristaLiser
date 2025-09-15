import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ProductosMasVendidosService } from './productos-mas-vendidos.service';
import { CreateProductosMasVendidosDto } from './dto/create-productos-mas-vendidos.dto';
import { UpdateProductosMasVendidosDto } from './dto/update-productos-mas-vendidos.dto';
import { ProductosMasVendidos } from './productos-mas-vendidos.entity';

@Controller('productos-mas-vendidos')
export class ProductosMasVendidosController {
  constructor(private readonly service: ProductosMasVendidosService) {}

  @Get()
  getAll(): Promise<ProductosMasVendidos[]> {
    return this.service.findAll();
  }

  @Get(':productoId')
  getOne(@Param('productoId') productoId: string): Promise<ProductosMasVendidos> {
    return this.service.findOne(+productoId);
  }

  @Post()
  create(@Body() dto: CreateProductosMasVendidosDto): Promise<ProductosMasVendidos> {
    return this.service.create(dto);
  }

  @Put(':productoId')
  update(
    @Param('productoId') productoId: string,
    @Body() dto: UpdateProductosMasVendidosDto,
  ): Promise<ProductosMasVendidos> {
    return this.service.update(+productoId, dto);
  }

  @Delete(':productoId')
  remove(@Param('productoId') productoId: string): Promise<void> {
    return this.service.remove(+productoId);
  }
}