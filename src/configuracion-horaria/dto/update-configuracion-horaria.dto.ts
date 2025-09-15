import { PartialType } from '@nestjs/mapped-types';
import { CreateConfiguracionHorariaDto } from './create-configuracion-horaria.dto';

export class UpdateConfiguracionHorariaDto extends PartialType(CreateConfiguracionHorariaDto) {}