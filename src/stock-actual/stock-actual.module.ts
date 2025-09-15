import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockActualService } from './stock-actual.service';
import { StockActualController } from './stock-actual.controller';
import { StockActual } from './stock-actual.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StockActual])],
  providers: [StockActualService],
  controllers: [StockActualController],
  exports: [ StockActualService, TypeOrmModule],
})
export class StockActualModule {}