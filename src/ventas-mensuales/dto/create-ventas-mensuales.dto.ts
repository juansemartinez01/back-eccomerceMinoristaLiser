import { IsDateString, IsNumber, Min, IsInt } from 'class-validator';

export class CreateVentasMensualesDto {
  @IsDateString()
  mes: string;

  @IsNumber()
  @Min(0)
  total_ventas: number;

  @IsInt()
  cantidad_facturas: number;
}
