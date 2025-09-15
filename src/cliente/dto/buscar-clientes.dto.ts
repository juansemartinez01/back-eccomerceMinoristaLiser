import { IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class BuscarClientesDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  q?: string;
}
