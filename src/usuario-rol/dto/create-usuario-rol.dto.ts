import { IsInt } from 'class-validator';

export class CreateUsuarioRolDto {
  @IsInt()
  usuarioId: number;

  @IsInt()
  rolId: number;
}
