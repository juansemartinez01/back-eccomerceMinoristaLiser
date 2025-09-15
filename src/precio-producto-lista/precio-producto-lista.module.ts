import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrecioProductoLista } from './precio-producto-lista.entity';
import { PrecioProductoListaService } from './precio-producto-lista.service';
import { PrecioProductoListaController } from './precio-producto-lista.controller';
import { Producto } from 'src/producto/producto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PrecioProductoLista,Producto])],
  providers: [PrecioProductoListaService],
  controllers: [PrecioProductoListaController],
})
export class PrecioProductoListaModule {}
