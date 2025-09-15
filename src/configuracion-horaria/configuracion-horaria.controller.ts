import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ConfiguracionHorariaService } from './configuracion-horaria.service';
import { CreateConfiguracionHorariaDto } from './dto/create-configuracion-horaria.dto';
import { UpdateConfiguracionHorariaDto } from './dto/update-configuracion-horaria.dto';

@Controller('configuracion-horaria')
export class ConfiguracionHorariaController {
  constructor(private readonly service: ConfiguracionHorariaService) {}

  @Get()
  getAll() {
    return this.service.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateConfiguracionHorariaDto) {
    const created = await this.service.create(dto);
    return {
      message: 'Configuración horaria creada correctamente',
      data: created,
    };
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() dto: UpdateConfiguracionHorariaDto) {
    const updated = await this.service.update(+id, dto);
    return {
      message: 'Configuración horaria actualizada correctamente',
      data: updated,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    await this.service.remove(+id);
    return {
      message: 'Configuración horaria eliminada correctamente',
    };
  }
}
