import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DataSource } from 'typeorm';

@Injectable()
export class EstadisticasService {
  constructor(private readonly dataSource: DataSource) {}

  


  

async getTotalPorPeriodo(periodo: 'dia' | 'semana' | 'mes', desde: string, hasta: string) {
    let campoGroup = '';
    switch (periodo) {
      case 'dia':
        campoGroup = 'fecha';
        break;
      case 'semana':
        campoGroup = "DATE_TRUNC('week', fecha)";
        break;
      case 'mes':
        campoGroup = "DATE_TRUNC('month', fecha)";
        break;
      default:
        throw new Error('Periodo no válido. Usar dia, semana o mes.');
    }

    const query = `
      SELECT ${campoGroup} AS periodo, SUM(total_ingresos) AS total
      FROM vista_total_ingresos_por_dia
      WHERE fecha BETWEEN $1 AND $2
      GROUP BY periodo
      ORDER BY periodo
    `;

    return await this.dataSource.query(query, [desde, hasta]);
  }



  async getProductosVendidosPorPeriodo(
  periodo: 'dia' | 'semana' | 'mes',
  desde: string,
  hasta: string
) {
  let campoGroup = '';
  switch (periodo) {
    case 'dia':
      campoGroup = 'fecha';
      break;
    case 'semana':
      campoGroup = "DATE_TRUNC('week', fecha)";
      break;
    case 'mes':
      campoGroup = "DATE_TRUNC('month', fecha)";
      break;
    default:
      throw new Error('Periodo no válido. Usar dia, semana o mes.');
  }

  const query = `
    SELECT 
      ${campoGroup} AS periodo,
      producto_id,
      nombre_producto,
      SUM(cantidad_vendida) AS total_vendido
    FROM vista_productos_vendidos_por_dia
    WHERE fecha BETWEEN $1 AND $2
    GROUP BY periodo, producto_id, nombre_producto
    ORDER BY periodo, total_vendido DESC
  `;

  return await this.dataSource.query(query, [desde, hasta]);
}

async getPedidosRealizadosPorPeriodo(
  periodo: 'dia' | 'semana' | 'mes',
  desde: string,
  hasta: string
) {
  let campoGroup = '';
  switch (periodo) {
    case 'dia':
      campoGroup = 'fecha';
      break;
    case 'semana':
      campoGroup = "DATE_TRUNC('week', fecha)";
      break;
    case 'mes':
      campoGroup = "DATE_TRUNC('month', fecha)";
      break;
    default:
      throw new Error('Periodo no válido. Usar dia, semana o mes.');
  }

  const query = `
    SELECT 
      ${campoGroup} AS periodo,
      SUM(cantidad_pedidos) AS total_pedidos
    FROM vista_pedidos_realizados_por_dia
    WHERE fecha BETWEEN $1 AND $2
    GROUP BY periodo
    ORDER BY periodo
  `;

  return await this.dataSource.query(query, [desde, hasta]);
}



async getIngresosPorDiaDesdeVista(desde: string, hasta: string) {
  const query = `
    SELECT dia AS periodo, ingresos_totales
    FROM ingresos_por_dia
    WHERE dia BETWEEN $1 AND $2
    ORDER BY dia DESC
  `;
  return await this.dataSource.query(query, [desde, hasta]);
}






async getIngresosPorSemanaDesdeVista(desde: string, hasta: string) {
  const query = `
    SELECT semana AS periodo, ingresos_totales
    FROM ingresos_por_semana
    WHERE semana BETWEEN $1 AND $2
    ORDER BY semana DESC
  `;
  return await this.dataSource.query(query, [desde, hasta]);
}


async getIngresosPorMesDesdeVista(desde: string, hasta: string) {
  const query = `
    SELECT mes AS periodo, ingresos_totales
    FROM ingresos_por_mes
    WHERE mes BETWEEN $1 AND $2
    ORDER BY mes DESC
  `;
  return await this.dataSource.query(query, [desde, hasta]);
}


// estadisticas.service.ts
async getPromedioGeneradoPorProducto(desde: string, hasta: string) {
  // Primero intento recuperar de la cache
  const cached = await this.dataSource.query(
    `SELECT * FROM promedio_precio_producto_cache WHERE desde = $1 AND hasta = $2`,
    [desde, hasta]
  );

  if (cached.length > 0) {
    return cached;
  }

  // Si no hay cache, calculo y guardo
  const query = `
    SELECT 
      i.producto_id, 
      p.nombre, 
      AVG(i.precio_unitario) AS promedio_precio
    FROM items_pedido i
    JOIN pedidos pe ON pe.id = i.pedido_id
    JOIN productos p ON p.id = i.producto_id
    WHERE pe.fecha_hora BETWEEN $1 AND $2
    GROUP BY i.producto_id, p.nombre
    ORDER BY promedio_precio DESC
  `;

  const resultado = await this.dataSource.query(query, [desde, hasta]);

  // Guardo en cache para este período
  for (const row of resultado) {
    await this.dataSource.query(
      `INSERT INTO promedio_precio_producto_cache (producto_id, nombre, promedio_precio, desde, hasta)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (producto_id, desde, hasta) DO UPDATE 
       SET promedio_precio = EXCLUDED.promedio_precio, nombre = EXCLUDED.nombre`,
      [row.producto_id, row.nombre, row.promedio_precio, desde, hasta]
    );
  }

  return resultado;
}

@Cron('0 3 1 * *') // Cada mes el día 1 a las 03:00 AM
async refrescarPromediosMesActual() {
  const hoy = new Date();
  const desde = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  const hasta = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);

  const desdeStr = desde.toISOString().split('T')[0];
  const hastaStr = hasta.toISOString().split('T')[0];

  await this.getPromedioGeneradoPorProducto(desdeStr, hastaStr);
}

async refrescarPromedioPrecioProducto() {
  await this.dataSource.query('REFRESH MATERIALIZED VIEW promedio_precio_producto');
}






@Cron('0 0 * * *') // todos los días a la medianoche
async refrescarVistasEstadisticas() {
  await this.dataSource.query('REFRESH MATERIALIZED VIEW ingresos_por_dia');
  await this.dataSource.query('REFRESH MATERIALIZED VIEW ingresos_por_semana');
  await this.dataSource.query('REFRESH MATERIALIZED VIEW ingresos_por_mes');
  await this.refrescarPromedioPrecioProducto();


}



// 🔁 Cronjob: refresca cada 5 minutos
  @Cron('0 0 * * *') // todos los días a la medianoche
  async refrescarVistaTotalIngresos() {
    await this.dataSource.query('REFRESH MATERIALIZED VIEW CONCURRENTLY vista_total_ingresos_por_dia');
    console.log('[CRON] Vista total_ingresos actualizada');
  }


  @Cron('0 0 * * *') // Cada 5 minutos
async refrescarVistaProductosVendidos() {
  await this.dataSource.query('REFRESH MATERIALIZED VIEW CONCURRENTLY vista_productos_vendidos_por_dia');
  console.log('[CRON] Vista productos_vendidos actualizada');
}

@Cron('0 0 * * *') // cada 5 minutos
async refrescarVistaPedidosRealizados() {
  await this.dataSource.query('REFRESH MATERIALIZED VIEW CONCURRENTLY vista_pedidos_realizados_por_dia');
  console.log('[CRON] Vista pedidos_realizados actualizada');
}


}
