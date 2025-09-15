import { IsInt, Min, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class CreatePrecioProductoListaDto {
  @IsInt()
  listaId: number;

  @IsInt()
  productoId: number;

  @IsNumber()
  @Min(0)
  precioUnitario: number;

  @IsBoolean()
  @IsOptional()
  oferta?: boolean;

  @IsNumber()
  @IsOptional()
  @Min(0)
  precio_oferta?: number;
}