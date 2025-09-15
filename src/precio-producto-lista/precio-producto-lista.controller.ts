import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { PrecioProductoListaService } from './precio-producto-lista.service';
import { CreatePrecioProductoListaDto } from './dto/create-precio-producto-lista.dto';
import { UpdatePrecioProductoListaDto } from './dto/update-precio-producto-lista.dto';
import { PrecioProductoLista } from './precio-producto-lista.entity';

@Controller('precio-producto-lista')
export class PrecioProductoListaController {
  constructor(private readonly service: PrecioProductoListaService) {}

  @Get()
  getAll(): Promise<PrecioProductoLista[]> {
    return this.service.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string): Promise<PrecioProductoLista> {
    return this.service.findOne(+id);
  }

  @Post()
  create(@Body() dto: CreatePrecioProductoListaDto): Promise<PrecioProductoLista> {
    return this.service.create(dto);
  }

  @Put(':listaId/:productoId')
  update(
    @Param('listaId') listaId: string,
    @Param('productoId') productoId: string,
    @Body() dto: UpdatePrecioProductoListaDto
  ): Promise<PrecioProductoLista> {
    return this.service.update(+listaId, +productoId, dto);
  }


  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(+id);
  }

  @Delete()
  async eliminarPorProductoYLista(
    @Query('listaId') listaId: number,
    @Query('productoId') productoId: number
  ) {
    return this.service.eliminarPorProductoYLista(listaId, productoId);
  }
}
