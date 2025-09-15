// src/stock/dto/agregar-stock.dto.ts
import { IsInt, Min } from 'class-validator';

export class AgregarStockDto {
  @IsInt()
  productoId: number;

  @IsInt()
  almacenId: number;

  @IsInt()
  @Min(1)
  cantidad: number;

  @IsInt()
  usuarioId: number;
}
