import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Unidad } from './unidad.entity';
import { UnidadService } from './unidad.service';
import { UnidadController } from './unidad.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Unidad])],
  providers: [UnidadService],
  controllers: [UnidadController],
  exports: [UnidadService],
})
export class UnidadModule {}
