import { IsString, IsNotEmpty, MaxLength, IsBoolean, Matches } from 'class-validator';

export class CreateConfiguracionHorariaDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  dia: string;

  @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/)
  horaInicio: string;

  @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/)
  horaFin: string;

  @IsBoolean()
  habilitado: boolean;
}
