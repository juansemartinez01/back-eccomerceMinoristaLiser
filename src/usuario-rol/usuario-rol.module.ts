import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioRol } from './usuario-rol.entity';
import { UsuarioRolService } from './usuario-rol.service';
import { UsuarioRolController } from './usuario-rol.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UsuarioRol])],
  providers: [UsuarioRolService],
  controllers: [UsuarioRolController],
})
export class UsuarioRolModule {}
