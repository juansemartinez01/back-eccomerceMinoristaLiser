import { IsInt, IsDateString, IsNumber, Min } from 'class-validator';

export class CreatePrecioDelDiaDto {
  @IsInt()
  listaId: number;

  @IsInt()
  productoId: number;

  @IsDateString()
  fecha: string;

  @IsNumber()
  @Min(0)
  precioUnitario: number;
}
