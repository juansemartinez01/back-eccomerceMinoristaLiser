import { PartialType } from '@nestjs/mapped-types';
import { CreatePrecioDelDiaDto } from './create-precio-del-dia.dto';

export class UpdatePrecioDelDiaDto extends PartialType(CreatePrecioDelDiaDto) {}