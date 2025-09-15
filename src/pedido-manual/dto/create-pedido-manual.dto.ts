import {
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  IsDateString,
  IsOptional,
} from 'class-validator';
import { CreatePedidoWithItemsDto } from 'src/pedido/dto/create-pedido-with-items.dto';

export class CreatePedidoManualDto extends CreatePedidoWithItemsDto {
  @IsString()
  @IsNotEmpty()
  mensajeOriginal: string;

  @IsOptional()
  @IsDateString()
  fechaCarga?: string;

  @IsOptional()
  @IsString()
  nombreCliente?: string;
}
