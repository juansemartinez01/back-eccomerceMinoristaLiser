import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrecioDelDia } from './precio-del-dia.entity';
import { PrecioDelDiaService } from './precio-del-dia.service';
import { PrecioDelDiaController } from './precio-del-dia.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PrecioDelDia])],
  providers: [PrecioDelDiaService],
  controllers: [PrecioDelDiaController],
})
export class PrecioDelDiaModule {}