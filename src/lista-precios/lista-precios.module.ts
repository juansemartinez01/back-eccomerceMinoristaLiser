import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListaPrecios } from './lista-precios.entity';
import { ListaPreciosService } from './lista-precios.service';
import { ListaPreciosController } from './lista-precios.controller';
import { PrecioProductoLista } from 'src/precio-producto-lista/precio-producto-lista.entity';
import { Producto } from 'src/producto/producto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ListaPrecios, PrecioProductoLista, Producto])],
  providers: [ListaPreciosService],
  controllers: [ListaPreciosController],
})
export class ListaPreciosModule {}