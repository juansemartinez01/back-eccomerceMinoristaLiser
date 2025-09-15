import { IsInt, Min, IsString, MaxLength, IsNumber } from 'class-validator';

export class CreateProductosMasVendidosDto {
  @IsInt()
  productoId: number;

  @IsString()
  @MaxLength(255)
  nombre: string;

  @IsInt()
  @Min(0)
  cantidad_total: number;

  @IsNumber()
  @Min(0)
  ingresos_generados: number;
}
