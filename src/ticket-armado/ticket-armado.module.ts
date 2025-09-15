import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketArmado } from './ticket-armado.entity';
import { TicketArmadoService } from './ticket-armado.service';
import { TicketArmadoController } from './ticket-armado.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TicketArmado])],
  providers: [TicketArmadoService],
  controllers: [TicketArmadoController],
})
export class TicketArmadoModule {}