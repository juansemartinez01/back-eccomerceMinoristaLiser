import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductosMasVendidos } from './productos-mas-vendidos.entity';
import { ProductosMasVendidosService } from './productos-mas-vendidos.service';
import { ProductosMasVendidosController } from './productos-mas-vendidos.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProductosMasVendidos])],
  providers: [ProductosMasVendidosService],
  controllers: [ProductosMasVendidosController],
})
export class ProductosMasVendidosModule {}