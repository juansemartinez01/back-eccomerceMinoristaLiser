import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, Query } from '@nestjs/common';
import { PedidoService } from './pedido.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { Pedido } from './pedido.entity';
import { ItemPedido } from 'src/item-pedido/item-pedido.entity';
import { ItemPedidoService } from 'src/item-pedido/item-pedido.service';
import { Producto } from 'src/producto/producto.entity';
import { CreatePedidoWithItemsDto } from './dto/create-pedido-with-items.dto';

@Controller('pedidos')
export class PedidoController {
  constructor(
    private readonly service: PedidoService,
    private readonly ItemPedidoService: ItemPedidoService,
  ) {}
  @Get()
  getAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50,
  ) {
    return this.service.findAll(page, limit);
  }


      @Get('con-nombre-manual')
  getPedidosConNombreClienteManual(
    @Query('fechaDesde') fechaDesde?: string,
    @Query('fechaHasta') fechaHasta?: string,
    @Query('estado') estado?: string, // Puede ser "pendiente", "armando", o "pendiente,armando"
    @Query('estadoPago') estadoPago?: string,
    @Query('clienteId') clienteId?: string,
    @Query('usuarioId') usuarioId?: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '50',
    @Query('ordenPorFecha') ordenPorFecha: 'ASC' | 'DESC' = 'ASC',
    @Query('ordenCampo') ordenCampo: string = 'fechaHora',
  ) {
    return this.service.obtenerTodosConNombreClienteManual(
      fechaDesde,
      fechaHasta,
      estado,
      estadoPago,
      clienteId ? +clienteId : undefined,
      usuarioId ? +usuarioId : undefined,
      +page,
      +limit,
      ordenCampo,
      ordenPorFecha,
    );
  }



  @Get(':id')
  getOne(@Param('id') id: string): Promise<Pedido> {
    return this.service.findOne(+id);
  }

  @Post()
  create(@Body() dto: CreatePedidoDto): Promise<Pedido> {
    return this.service.create(dto);
  }

  @Post('nuevo-pedido-con-items')
  async createWithItems(
    @Body() dto: CreatePedidoWithItemsDto,
  ): Promise<Pedido> {
    return this.service.createWithItems(dto);
  }

  @Put(':id/cancelar')
  async cancelar(@Param('id', ParseIntPipe) id: number) {
    return this.service.cancelarPedido(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePedidoDto,
  ): Promise<Pedido> {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(+id);
  }

  
  /**
   * GET /pedidos/:pedidoId/items
   * Devuelve [ { pedido, productos: […] } ]
   */
  @Get(':pedidoId/items')
  async getItemsByPedido(
    @Param('pedidoId', ParseIntPipe) pedidoId: number,
  ): Promise<Array<{
    pedido: Pedido;
    productos: Array<Producto & { cantidad: number; precio_unitario: string }>;
  }>> {
    const grouped = await this.ItemPedidoService.findGroupedByPedidoId(pedidoId);
    return [grouped];
  }
}