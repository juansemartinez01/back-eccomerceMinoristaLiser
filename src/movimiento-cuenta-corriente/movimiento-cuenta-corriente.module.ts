import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovimientoCuentaCorriente } from './movimiento-cuenta-corriente.entity';
import { MovimientoCuentaCorrienteService } from './movimiento-cuenta-corriente.service';
import { MovimientoCuentaCorrienteController } from './movimiento-cuenta-corriente.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MovimientoCuentaCorriente])],
  providers: [MovimientoCuentaCorrienteService],
  controllers: [MovimientoCuentaCorrienteController],
})
export class MovimientoCuentaCorrienteModule {}