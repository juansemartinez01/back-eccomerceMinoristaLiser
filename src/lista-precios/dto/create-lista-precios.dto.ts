import { IsString, IsNotEmpty, MaxLength, IsDateString } from 'class-validator';

export class CreateListaPreciosDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  nombre: string;

  @IsDateString()
  fecha: string;
}