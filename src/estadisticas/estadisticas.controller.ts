import { BadRequestException, Controller, Get, Param, Query } from '@nestjs/common';
import { EstadisticasService } from './estadisticas.service';
import * as dayjs from 'dayjs';
import 'dayjs/locale/es'; // español para formateo

@Controller('estadisticas')
export class EstadisticasController {
  constructor(private readonly estadisticasService: EstadisticasService) {}

  


@Get('total-por-periodo')
  async getTotalPorPeriodo(
    @Query('periodo') periodo: 'dia' | 'semana' | 'mes',
    @Query('desde') desde: string,
    @Query('hasta') hasta: string
  ) {
    return await this.estadisticasService.getTotalPorPeriodo(periodo, desde, hasta);
  }


@Get('productos-vendidos')
async getProductosVendidos(
  @Query('periodo') periodo: 'dia' | 'semana' | 'mes',
  @Query('desde') desde: string,
  @Query('hasta') hasta: string
) {
  return await this.estadisticasService.getProductosVendidosPorPeriodo(periodo, desde, hasta);
}

@Get('pedidos-realizados')
async getPedidosRealizados(
  @Query('periodo') periodo: 'dia' | 'semana' | 'mes',
  @Query('desde') desde: string,
  @Query('hasta') hasta: string
) {
  return await this.estadisticasService.getPedidosRealizadosPorPeriodo(periodo, desde, hasta);
}


@Get('promedio-generado-producto')
  async getPromedioGeneradoProducto(
    @Query('desde') desde: string,
    @Query('hasta') hasta: string
  ) {
    const resultados = await this.estadisticasService.getPromedioGeneradoPorProducto(desde, hasta);

    return resultados.map(r => ({
      producto_id: r.producto_id,
      nombre: r.nombre,
      promedio_precio: Number(r.promedio_precio),
    }));
  }




}
