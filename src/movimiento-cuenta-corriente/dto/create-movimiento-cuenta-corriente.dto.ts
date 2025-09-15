import { IsInt, IsDateString, IsNumber, Min, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateMovimientoCuentaCorrienteDto {
  @IsInt()
  clienteId: number;

  @IsDateString()
  fecha: string;

  @IsNumber()
  @Min(0)
  monto: number;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsString()
  @MaxLength(50)
  tipo_movimiento: string;
}
