import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsNumber,
  Min,
  IsInt,
  IsOptional,
  IsBoolean,
  IsDecimal,
} from 'class-validator';

export class CreateProductoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  nombre: string;

  @IsNumber()
  @Min(0)
  precio_base: number;

  @IsInt()
  unidadId: number;

  @IsInt()
  tipoProductoId: number;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsBoolean()
  vacio: boolean;

  @IsBoolean()
  oferta: boolean;

  @IsNumber()
  @IsOptional()
  precio_oferta?: number;

  @IsBoolean()
  activo: boolean;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  imagen?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  id_interno: string;

  @IsNumber() @Min(0) @IsOptional()
  precioVacio?: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  empresa?: string;
}