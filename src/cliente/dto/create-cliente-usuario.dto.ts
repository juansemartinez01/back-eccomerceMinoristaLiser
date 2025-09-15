import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsNumber,
  Min,
  IsInt,
  IsOptional,
  IsEmail,
  IsDate,
  IsBoolean,
} from 'class-validator';

export class CreateClienteUsuarioDto {
  // Datos del cliente
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

  @IsInt()
  @IsOptional()
  listaPreciosId?: number;

  // Datos del usuario asociado
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  usuario: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEmail()
  @MaxLength(255)
  email: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  ultimoLogin?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  ultimaCompra?: Date;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  @IsOptional()
  @IsInt({ each: true })
  roles?: number[];
}
