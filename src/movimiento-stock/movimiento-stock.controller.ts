import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { MovimientoStockService } from './movimiento-stock.service';
import { CreateMovimientoStockDto } from './dto/create-movimiento-stock.dto';
import { UpdateMovimientoStockDto } from './dto/update-movimiento-stock.dto';
import { MovimientoStock } from './movimiento-stock.entity';

@Controller('movimientos-stock')
export class MovimientoStockController {
  constructor(private readonly service: MovimientoStockService) {}

  @Get()
  getAll(): Promise<MovimientoStock[]> {
    return this.service.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string): Promise<MovimientoStock> {
    return this.service.findOne(+id);
  }

  @Post()
  create(@Body() dto: CreateMovimientoStockDto): Promise<MovimientoStock> {
    return this.service.create(dto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateMovimientoStockDto,
  ): Promise<MovimientoStock> {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(+id);
  }
}