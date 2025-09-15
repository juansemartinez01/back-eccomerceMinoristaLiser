import { IsInt, Min, IsNumber, IsDateString, IsString, MaxLength, IsBoolean } from 'class-validator';

export class CreateFacturaDto {
  @IsInt()
  pedidoId: number;

  @IsNumber()
  @Min(0)
  total: number;

  @IsDateString()
  fechaPago: string;

  @IsString()
  @MaxLength(50)
  formaPago: string;

  @IsBoolean()
  legal: boolean;
}