import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { VentasMensualesService } from './ventas-mensuales.service';
import { CreateVentasMensualesDto } from './dto/create-ventas-mensuales.dto';
import { UpdateVentasMensualesDto } from './dto/update-ventas-mensuales.dto';
import { VentasMensuales } from './ventas-mensuales.entity';

@Controller('ventas-mensuales')
export class VentasMensualesController {
  constructor(private readonly service: VentasMensualesService) {}

  @Get()
  getAll(): Promise<VentasMensuales[]> {
    return this.service.findAll();
  }

  @Get(':mes')
  getOne(@Param('mes') mes: string): Promise<VentasMensuales> {
    return this.service.findOne(mes);
  }

  @Post()
  create(@Body() dto: CreateVentasMensualesDto): Promise<VentasMensuales> {
    return this.service.create(dto);
  }

  @Put(':mes')
  update(
    @Param('mes') mes: string,
    @Body() dto: UpdateVentasMensualesDto,
  ): Promise<VentasMensuales> {
    return this.service.update(mes, dto);
  }

  @Delete(':mes')
  remove(@Param('mes') mes: string): Promise<void> {
    return this.service.remove(mes);
  }
}