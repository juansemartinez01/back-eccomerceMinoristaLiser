import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VentasMensuales } from './ventas-mensuales.entity';
import { VentasMensualesService } from './ventas-mensuales.service';
import { VentasMensualesController } from './ventas-mensuales.controller';

@Module({
  imports: [TypeOrmModule.forFeature([VentasMensuales])],
  providers: [VentasMensualesService],
  controllers: [VentasMensualesController],
})
export class VentasMensualesModule {}