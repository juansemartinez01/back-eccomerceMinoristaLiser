import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { StockActualService } from './stock-actual.service';
import { CreateStockActualDto } from './dto/create-stock-actual.dto';
import { UpdateStockActualDto } from './dto/update-stock-actual.dto';
import { StockActual } from './stock-actual.entity';
import { AgregarStockDto } from './dto/agregar-stock.dto';
import { Cron, CronExpression } from '@nestjs/schedule';

@Controller('stock-actual')
export class StockActualController {
  constructor(private readonly service: StockActualService) {}

  @Get()
  getAll(): Promise<StockActual[]> {
    return this.service.findAll();
  }

  @Get(':productoId/:almacenId')
  getOne(
    @Param('productoId') productoId: string,
    @Param('almacenId') almacenId: string,
  ): Promise<StockActual> {
    return this.service.findOne(+productoId, +almacenId);
  }

  @Post()
  create(@Body() dto: CreateStockActualDto): Promise<StockActual> {
    return this.service.create(dto);
  }

  @Put(':productoId/:almacenId')
  update(
    @Param('productoId') productoId: string,
    @Param('almacenId') almacenId: string,
    @Body() dto: UpdateStockActualDto,
  ): Promise<StockActual> {
    return this.service.update(+productoId, +almacenId, dto);
  }

  @Delete(':productoId/:almacenId')
  remove(
    @Param('productoId') productoId: string,
    @Param('almacenId') almacenId: string,
  ): Promise<void> {
    return this.service.remove(+productoId, +almacenId);
  }

  @Post('agregar-stock')
    async agregarStock(@Body() dto: AgregarStockDto) {
    return this.service.agregarStock(dto);
  }

  // Endpoint para resetear el stock diario a 4000 en todos los productos
  // Este endpoint no recibe parámetros, simplemente resetea el stock de todos los productos a 4000
  @Put('reset-diario')
  async resetStock(): Promise<{ message: string; updated: number }> {
  const result = await this.service.resetStockDiario();
  return {
    message: 'Stock reseteado a 4000 en todos los productos',
    updated: result.updated,
  };
  }

  // @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  // async handleResetStockDiario() {
  //   const result = await this.resetStock();
  //   console.log(`Stock reseteado a 4000 en ${result.updated} registros`);
  // }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT) 
  async handleResetStockDiario() {
    try {
      const result = await this.resetStock();
      console.log(`⏰ [CRON TEST] Stock reseteado a 4000 en ${result.updated} registros`);
    } catch (error) {
      console.error('❌ Error al resetear stock:', error);
    }
  }

}
