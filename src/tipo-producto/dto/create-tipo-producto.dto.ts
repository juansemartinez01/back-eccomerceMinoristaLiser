import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateTipoProductoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;
}