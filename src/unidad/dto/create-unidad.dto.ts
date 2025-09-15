import { IsString, IsNotEmpty, MaxLength, IsOptional } from 'class-validator';

export class CreateUnidadDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  abreviatura?: string;
}