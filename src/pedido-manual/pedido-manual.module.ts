import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PedidoManual } from './pedido-manual.entity';
import { PedidoManualService } from './pedido-manual.service';
import { PedidoManualController } from './pedido-manual.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PedidoManual])],
  providers: [PedidoManualService],
  controllers: [PedidoManualController],
})
export class PedidoManualModule {}