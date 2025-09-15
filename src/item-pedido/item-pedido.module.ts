import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemPedido } from './item-pedido.entity';
import { ItemPedidoService } from './item-pedido.service';
import { ItemPedidoController } from './item-pedido.controller';
import { PrecioProductoLista } from 'src/precio-producto-lista/precio-producto-lista.entity';
import { StockActual } from 'src/stock-actual/stock-actual.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ItemPedido,PrecioProductoLista,StockActual,])],
  providers: [ItemPedidoService],
  controllers: [ItemPedidoController],
})
export class ItemPedidoModule {}