import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovimientoStockService } from './movimiento-stock.service';
import { MovimientoStockController } from './movimiento-stock.controller';
import { MovimientoStock } from './movimiento-stock.entity';
import { AlmacenModule } from 'src/almacen/almacen.module';
import { StockActualModule } from 'src/stock-actual/stock-actual.module';
import { ProductoModule } from 'src/producto/producto.module';

@Module({
  imports: [TypeOrmModule.forFeature([MovimientoStock]),
    AlmacenModule,
    StockActualModule,
    ProductoModule,
  ],
  providers: [MovimientoStockService],
  controllers: [MovimientoStockController],
  exports: [ MovimientoStockService ],
})
export class MovimientoStockModule {}
