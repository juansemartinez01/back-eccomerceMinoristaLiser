import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { PrecioDelDiaService } from './precio-del-dia.service';
import { CreatePrecioDelDiaDto } from './dto/create-precio-del-dia.dto';
import { UpdatePrecioDelDiaDto } from './dto/update-precio-del-dia.dto';
import { PrecioDelDia } from './precio-del-dia.entity';

@Controller('precios-del-dia')
export class PrecioDelDiaController {
  constructor(private readonly service: PrecioDelDiaService) {}

  @Get()
  getAll(): Promise<PrecioDelDia[]> {
    return this.service.findAll();
  }

  @Get(':listaId/:productoId/:fecha')
  getOne(
    @Param('listaId') listaId: string,
    @Param('productoId') productoId: string,
    @Param('fecha') fecha: string,
  ): Promise<PrecioDelDia> {
    return this.service.findOne(+listaId, +productoId, fecha);
  }

  @Post()
  create(@Body() dto: CreatePrecioDelDiaDto): Promise<PrecioDelDia> {
    return this.service.create(dto);
  }

  @Put(':listaId/:productoId/:fecha')
  update(
    @Param('listaId') listaId: string,
    @Param('productoId') productoId: string,
    @Param('fecha') fecha: string,
    @Body() dto: UpdatePrecioDelDiaDto,
  ): Promise<PrecioDelDia> {
    return this.service.update(+listaId, +productoId, fecha, dto);
  }

  @Delete(':listaId/:productoId/:fecha')
  remove(
    @Param('listaId') listaId: string,
    @Param('productoId') productoId: string,
    @Param('fecha') fecha: string,
  ): Promise<void> {
    return this.service.remove(+listaId, +productoId, fecha);
  }
}
