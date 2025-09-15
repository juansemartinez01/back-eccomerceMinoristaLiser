import { PartialType } from '@nestjs/mapped-types';
import { CreateListaPreciosDto } from './create-lista-precios.dto';

export class UpdateListaPreciosDto extends PartialType(CreateListaPreciosDto) {}