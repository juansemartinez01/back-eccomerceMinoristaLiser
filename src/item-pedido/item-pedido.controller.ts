import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ItemPedidoService } from './item-pedido.service';
import { CreateItemPedidoDto } from './dto/create-item-pedido.dto';
import { UpdateItemPedidoDto } from './dto/update-item-pedido.dto';
import { ItemPedido } from './item-pedido.entity';

@Controller('items-pedido')
export class ItemPedidoController {
  constructor(private readonly service: ItemPedidoService) {}

  @Get()
  getAll(): Promise<ItemPedido[]> {
    return this.service.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string): Promise<ItemPedido> {
    return this.service.findOne(+id);
  }

  @Post()
  create(@Body() dto: CreateItemPedidoDto): Promise<ItemPedido> {
    return this.service.create(dto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateItemPedidoDto,
  ): Promise<ItemPedido> {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(+id);
  }
}