import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClienteModule } from './cliente/cliente.module';
import { UsuarioModule } from './usuario/usuario.module';
import { RoleModule } from './role/role.module';
import { UsuarioRolModule } from './usuario-rol/usuario-rol.module';
import { ProductoModule } from './producto/producto.module';
import { TipoProductoModule } from './tipo-producto/tipo-producto.module';
import { UnidadModule } from './unidad/unidad.module';
import { StockModule } from './stock/stock.module';
import { PedidoModule } from './pedido/pedido.module';
import { ItemPedidoModule } from './item-pedido/item-pedido.module';
import { FacturaModule } from './factura/factura.module';
import { TicketArmadoModule } from './ticket-armado/ticket-armado.module';
import { MovimientoCuentaCorrienteModule } from './movimiento-cuenta-corriente/movimiento-cuenta-corriente.module';
import { PedidoManualModule } from './pedido-manual/pedido-manual.module';
import { ListaPreciosModule } from './lista-precios/lista-precios.module';
import { PrecioProductoListaModule } from './precio-producto-lista/precio-producto-lista.module';
import { PrecioDelDiaModule } from './precio-del-dia/precio-del-dia.module';
import { VentasMensualesModule } from './ventas-mensuales/ventas-mensuales.module';
import { ConfiguracionHorariaModule } from './configuracion-horaria/configuracion-horaria.module';
import { ProductosMasVendidosModule } from './productos-mas-vendidos/productos-mas-vendidos.module';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';
import { AlmacenModule } from './almacen/almacen.module';
import { StockActualModule } from './stock-actual/stock-actual.module';
import { MovimientoStockModule } from './movimiento-stock/movimiento-stock.module';
import { ScheduleModule } from '@nestjs/schedule';
import { StockActualService } from './stock-actual/stock-actual.service';
import { EstadisticasModule } from './estadisticas/estadisticas.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'], }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'),
        autoLoadEntities: true,
        synchronize: true,
        ssl: {
          rejectUnauthorized: false,
        },
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),

    ClienteModule,

    UsuarioModule,

    RoleModule,

    UsuarioRolModule,

    ProductoModule,

    TipoProductoModule,

    UnidadModule,

    StockModule,

    PedidoModule,

    ItemPedidoModule,

    FacturaModule,

    TicketArmadoModule,

    MovimientoCuentaCorrienteModule,

    PedidoManualModule,

    ListaPreciosModule,

    PrecioProductoListaModule,

    PrecioDelDiaModule,

    VentasMensualesModule,

    ConfiguracionHorariaModule,

    ProductosMasVendidosModule,

    AuthModule,

    FilesModule,

    
    AlmacenModule,
    StockActualModule,
    MovimientoStockModule,
    EstadisticasModule,

    
  ],
  controllers: [AppController],
  providers: [AppService,StockActualService],
})
export class AppModule {}
