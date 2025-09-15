import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoProducto } from './tipo-producto.entity';
import { TipoProductoService } from './tipo-producto.service';
import { TipoProductoController } from './tipo-producto.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TipoProducto])],
  providers: [TipoProductoService],
  controllers: [TipoProductoController],
})
export class TipoProductoModule {}