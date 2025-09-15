import { IsInt, Min } from 'class-validator';

export class CreateStockDto {
  @IsInt()
  productoId: number;

  @IsInt()
  @Min(0)
  cantidad_disponible: number;
}