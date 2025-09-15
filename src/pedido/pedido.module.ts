import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pedido } from './pedido.entity';
import { PedidoService } from './pedido.service';
import { PedidoController } from './pedido.controller';
import { ItemPedidoService } from 'src/item-pedido/item-pedido.service';
import { ItemPedido } from 'src/item-pedido/item-pedido.entity';
import { PrecioProductoLista } from 'src/precio-producto-lista/precio-producto-lista.entity';
import { StockActual } from 'src/stock-actual/stock-actual.entity';
import { ItemPedidoController } from 'src/item-pedido/item-pedido.controller';
import { UsuarioService } from 'src/usuario/usuario.service';
import { Usuario } from 'src/usuario/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pedido]),
  TypeOrmModule.forFeature([ItemPedido,PrecioProductoLista,StockActual,Usuario]),
],
  providers: [PedidoService,ItemPedidoService,UsuarioService],
  controllers: [PedidoController,ItemPedidoController],
})
export class PedidoModule {}
