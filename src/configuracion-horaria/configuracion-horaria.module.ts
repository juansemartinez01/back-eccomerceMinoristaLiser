import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfiguracionHoraria } from './configuracion-horaria.entity';
import { ConfiguracionHorariaService } from './configuracion-horaria.service';
import { ConfiguracionHorariaController } from './configuracion-horaria.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ConfiguracionHoraria])],
  providers: [ConfiguracionHorariaService],
  controllers: [ConfiguracionHorariaController],
})
export class ConfiguracionHorariaModule {}