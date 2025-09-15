import { IsInt, Min, IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateMovimientoStockDto {
  @IsInt()
  producto_id: number;

  @IsInt()
  @IsOptional()
  origen_almacen?: number;

  @IsInt()
  @IsOptional()
  destino_almacen?: number;

  @IsInt()
  @Min(1)
  cantidad: number;

  @IsIn(['entrada', 'salida', 'traspaso'])
  tipo: 'entrada' | 'salida' | 'traspaso';

  @IsInt()
  @IsOptional()
  usuario_id?: number;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  motivo?: string;
}