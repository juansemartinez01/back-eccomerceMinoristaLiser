import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { PedidoManualService } from './pedido-manual.service';
import { CreatePedidoManualDto } from './dto/create-pedido-manual.dto';
import { UpdatePedidoManualDto } from './dto/update-pedido-manual.dto';
import { PedidoManual } from './pedido-manual.entity';

@Controller('pedidos-manuales')
export class PedidoManualController {
  constructor(private readonly service: PedidoManualService) {}

  @Get()
  getAll(): Promise<PedidoManual[]> {
    return this.service.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string): Promise<PedidoManual> {
    return this.service.findOne(+id);
  }

  

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePedidoManualDto,
  ): Promise<PedidoManual> {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(+id);
  }

  @Post()
  createManual(@Body() dto: CreatePedidoManualDto) {
    return this.service.createManual(dto);
  }

}