import { Controller, Get, Post, Put, Delete, Param, Body, Query, ParseIntPipe } from '@nestjs/common';
import { UsuarioRolService } from './usuario-rol.service';
import { CreateUsuarioRolDto } from './dto/create-usuario-rol.dto';
import { UpdateUsuarioRolDto } from './dto/update-usuario-rol.dto';
import { UsuarioRol } from './usuario-rol.entity';

@Controller('usuario-rol')
export class UsuarioRolController {
  constructor(private readonly service: UsuarioRolService) {}

  @Get()
  getAll(): Promise<UsuarioRol[]> {
    return this.service.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string): Promise<UsuarioRol> {
    return this.service.findOne(+id);
  }

  @Post()
  create(@Body() dto: CreateUsuarioRolDto): Promise<UsuarioRol> {
    return this.service.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUsuarioRolDto): Promise<UsuarioRol> {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(+id);
  }

  @Delete()
  async deleteByUsuarioAndRol(
    @Query('usuarioId', ParseIntPipe) usuarioId: number,
    @Query('rolId', ParseIntPipe) rolId: number,
  ): Promise<{ message: string }> {
    await this.service.removeByUsuarioAndRol(usuarioId, rolId);
    return { message: `Rol ${rolId} eliminado del usuario ${usuarioId}` };
  }
}