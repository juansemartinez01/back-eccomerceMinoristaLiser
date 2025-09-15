import { PartialType } from '@nestjs/mapped-types';
import { CreateTicketArmadoDto } from './create-ticket-armado.dto';

export class UpdateTicketArmadoDto extends PartialType(CreateTicketArmadoDto) {}