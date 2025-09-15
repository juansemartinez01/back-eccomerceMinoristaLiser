// src/data-source.ts
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

// 1) Fuerza la carga de .env.local
dotenv.config({ path: '.env.local' });

// 2) Comprueba que tengas password y sea un string
if (typeof process.env.DB_PASS !== 'string') {
  throw new Error('⚠️  La variable DB_PASS no está definida o no es un string en .env.local');
}

import { Cliente }                 from './cliente/cliente.entity';
import { Usuario }                 from './usuario/usuario.entity';
import { ListaPrecios }            from './lista-precios/lista-precios.entity';
import { PrecioProductoLista }     from './precio-producto-lista/precio-producto-lista.entity';
import { Producto }                from './producto/producto.entity';
import { Pedido }                  from './pedido/pedido.entity';
import { ItemPedido }             from './item-pedido/item-pedido.entity';
import { ConfiguracionHoraria }    from './configuracion-horaria/configuracion-horaria.entity';
import { Factura } from './factura/factura.entity';
import { MovimientoCuentaCorriente } from './movimiento-cuenta-corriente/movimiento-cuenta-corriente.entity';
import { PedidoManual } from './pedido-manual/pedido-manual.entity';
import { PrecioDelDia } from './precio-del-dia/precio-del-dia.entity';
import { ProductosMasVendidos } from './productos-mas-vendidos/productos-mas-vendidos.entity';
import { Role } from './role/role.entity';
import { Stock } from './stock/stock.entity';
import { TicketArmado } from './ticket-armado/ticket-armado.entity';
import { TipoProducto } from './tipo-producto/tipo-producto.entity';
import { Unidad } from './unidad/unidad.entity';
import { UsuarioRol } from './usuario-rol/usuario-rol.entity';
import { VentasMensuales } from './ventas-mensuales/ventas-mensuales.entity';
// …si tienes más entidades, agrégalas aquí…

export default new DataSource({
  type:     'postgres',
  schema:   'public',
  host:     process.env.DB_HOST,
  port:     +(process.env.DB_PORT  || 5432),
  username: process.env.DB_USER,
  password: process.env.DB_PASS  || '',
  database: process.env.DB_NAME,
  synchronize: false,
  logging:     false,

  // Import explícito de todas las entidades
  entities: [
    Cliente,
    Usuario,
    ListaPrecios,
    PrecioProductoLista,
    Producto,
    Pedido,
    ItemPedido,
    ConfiguracionHoraria,
    Factura,
    MovimientoCuentaCorriente,
    PedidoManual,
    PrecioDelDia,
    ProductosMasVendidos,
    Role,
    Stock,
    TicketArmado,
    TipoProducto,
    Unidad,
    UsuarioRol,
    VentasMensuales,



    
  ],

  // Migraciones en TS (desarrollo). Se crearán bajo src/migrations
  migrations: ['src/migrations/*.ts'],
});