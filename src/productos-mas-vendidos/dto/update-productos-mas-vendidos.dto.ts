import { PartialType } from '@nestjs/mapped-types';
import { CreateProductosMasVendidosDto } from './create-productos-mas-vendidos.dto';

export class UpdateProductosMasVendidosDto extends PartialType(CreateProductosMasVendidosDto) {}