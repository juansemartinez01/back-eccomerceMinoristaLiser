import { IsString, IsNotEmpty, MaxLength, IsNumber, Min, IsInt, IsOptional } from 'class-validator';

export class CreateClienteDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  nombre: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  telefono: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  direccion: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  tipo: string;

  @IsNumber()
  @Min(0)
  descuento: number;

  @IsNumber()
  @Min(0)
  saldo_cuenta_corriente: number;

  @IsInt() @IsOptional()
  listaPreciosId?: number;
}