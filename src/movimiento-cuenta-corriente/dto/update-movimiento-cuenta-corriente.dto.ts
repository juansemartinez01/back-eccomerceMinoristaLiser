import { PartialType } from '@nestjs/mapped-types';
import { CreateMovimientoCuentaCorrienteDto } from './create-movimiento-cuenta-corriente.dto';

export class UpdateMovimientoCuentaCorrienteDto extends PartialType(CreateMovimientoCuentaCorrienteDto) {}