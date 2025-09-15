import { PartialType } from '@nestjs/mapped-types';
import { CreatePedidoManualDto } from './create-pedido-manual.dto';

export class UpdatePedidoManualDto extends PartialType(CreatePedidoManualDto) {}