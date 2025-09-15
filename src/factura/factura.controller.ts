import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { FacturaService } from './factura.service';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { UpdateFacturaDto } from './dto/update-factura.dto';
import { Factura } from './factura.entity';

@Controller('facturas')
export class FacturaController {
  constructor(private readonly service: FacturaService) {}

  @Get()
  getAll(): Promise<Factura[]> {
    return this.service.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string): Promise<Factura> {
    return this.service.findOne(+id);
  }

  @Post()
  create(@Body() dto: CreateFacturaDto): Promise<Factura> {
    return this.service.create(dto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateFacturaDto,
  ): Promise<Factura> {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(+id);
  }
}