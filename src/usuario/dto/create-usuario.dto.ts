import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, MaxLength, IsEmail, IsInt, IsOptional, IsDate, IsBoolean } from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  nombre: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  usuario: string;

  @IsString() @IsNotEmpty() password: string;             

  @IsEmail()
  @MaxLength(255)
  email: string;

  @IsInt() @IsOptional()
  clienteId?: number;

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
