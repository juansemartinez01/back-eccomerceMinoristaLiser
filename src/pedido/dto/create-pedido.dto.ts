import {
  IsInt,
  IsNotEmpty,
  IsDateString,
  IsString,
  MaxLength,
  IsOptional,
} from 'class-validator';

export class CreatePedidoDto {
  @IsInt()
  clienteId: number;

  @IsInt()
  usuarioId: number;

  @IsDateString()
  fechaHora: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  canal: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  estado: string;

  @IsInt()
  @IsOptional()
  armadorId?: number;

  @IsInt()
  @IsOptional()
  entregadorId?: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  estadoPago: string;
}