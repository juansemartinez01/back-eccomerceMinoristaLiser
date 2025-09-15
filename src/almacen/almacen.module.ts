import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlmacenService } from './almacen.service';
import { AlmacenController } from './almacen.controller';
import { Almacen } from './almacen.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Almacen])],
  providers: [AlmacenService],
  controllers: [AlmacenController],
  exports: [ TypeOrmModule ],
})
export class AlmacenModule {}