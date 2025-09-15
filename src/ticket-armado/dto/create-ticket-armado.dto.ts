import { IsInt, IsOptional, IsString, MaxLength, IsNotEmpty } from 'class-validator';

export class CreateTicketArmadoDto {
  @IsInt()
  pedidoId: number;

  @IsInt()
  usuarioId: number;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  observaciones?: string;
}
