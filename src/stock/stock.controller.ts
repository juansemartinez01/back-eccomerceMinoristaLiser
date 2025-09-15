import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { StockService } from './stock.service';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { Stock } from './stock.entity';

@Controller('stock')
export class StockController {
  constructor(private readonly service: StockService) {}

  @Get()
  getAll(): Promise<Stock[]> {
    return this.service.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string): Promise<Stock> {
    return this.service.findOne(+id);
  }

  @Post()
  create(@Body() dto: CreateStockDto): Promise<Stock> {
    return this.service.create(dto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateStockDto,
  ): Promise<Stock> {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(+id);
  }
}