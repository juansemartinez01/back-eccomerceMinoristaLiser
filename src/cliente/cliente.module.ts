import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cliente } from './cliente.entity';
import { ClienteService } from './cliente.service';
import { ClienteController } from './cliente.controller';
import { ListaPrecios } from 'src/lista-precios/lista-precios.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cliente,ListaPrecios])],
  providers: [ClienteService],
  controllers: [ClienteController],
})
export class ClienteModule {}