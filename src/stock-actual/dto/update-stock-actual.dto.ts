import { PartialType } from '@nestjs/mapped-types';
import { CreateStockActualDto } from './create-stock-actual.dto';

export class UpdateStockActualDto extends PartialType(CreateStockActualDto) {}