import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfiguracionHoraria } from './configuracion-horaria.entity';
import { CreateConfiguracionHorariaDto } from './dto/create-configuracion-horaria.dto';
import { UpdateConfiguracionHorariaDto } from './dto/update-configuracion-horaria.dto';

@Injectable()
export class ConfiguracionHorariaService {
  constructor(
    @InjectRepository(ConfiguracionHoraria)
    private readonly repo: Repository<ConfiguracionHoraria>,
  ) {}

  findAll(): Promise<ConfiguracionHoraria[]> {
    return this.repo.find();
  }

  async findOne(id: number): Promise<ConfiguracionHoraria> {
    const config = await this.repo.findOneBy({ id });
    if (!config) throw new NotFoundException(`Configuración horaria ${id} no encontrada`);
    return config;
  }

  async create(dto: CreateConfiguracionHorariaDto): Promise<ConfiguracionHoraria> {
    if (dto.horaInicio >= dto.horaFin) {
      throw new BadRequestException('La hora de inicio debe ser anterior a la hora de fin');
    }

    if (dto.habilitado) {
      const existentes = await this.repo.find({
        where: { dia: dto.dia, habilitado: true },
      });

      const solapa = existentes.some(e =>
        dto.horaInicio < e.horaFin && dto.horaFin > e.horaInicio
      );

      if (solapa) {
        throw new BadRequestException('El horario se superpone con otra configuración habilitada');
      }
    }

    const config = this.repo.create(dto);
    return this.repo.save(config);
  }

  async update(id: number, dto: UpdateConfiguracionHorariaDto): Promise<ConfiguracionHoraria> {
    const existente = await this.findOne(id);

    const dia = dto.dia ?? existente.dia;
    const horaInicio = dto.horaInicio ?? existente.horaInicio;
    const horaFin = dto.horaFin ?? existente.horaFin;
    const habilitado = dto.habilitado ?? existente.habilitado;

    if (horaInicio >= horaFin) {
      throw new BadRequestException('La hora de inicio debe ser anterior a la hora de fin');
    }

    if (habilitado) {
      const otros = await this.repo.find({
        where: { dia, habilitado: true },
      });

      const solapa = otros.some(e =>
        e.id !== id &&
        horaInicio < e.horaFin &&
        horaFin > e.horaInicio
      );

      if (solapa) {
        throw new BadRequestException('El horario se superpone con otra configuración habilitada');
      }
    }

    await this.repo.update(id, dto as any);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const res = await this.repo.delete(id);
    if (res.affected === 0)
      throw new NotFoundException(`Configuración horaria ${id} no encontrada`);
  }
}
