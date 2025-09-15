import { PartialType } from '@nestjs/mapped-types';
import { CreatePrecioProductoListaDto } from './create-precio-producto-lista.dto';

export class UpdatePrecioProductoListaDto extends PartialType(CreatePrecioProductoListaDto) {}