// src/pedido/dto/create-pedido-with-items.dto.ts
import {
  IsInt,
  IsNotEmpty,
  IsDateString,
  IsString,
  MaxLength,
  IsOptional,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePedidoDto } from './create-pedido.dto';
import { CreateItemPedidoDto } from '../../item-pedido/dto/create-item-pedido.dto';

export class CreatePedidoWithItemsDto extends CreatePedidoDto {
  @ValidateNested({ each: true })
  @Type(() => CreateItemPedidoDto)
  @ArrayMinSize(1)
  items: CreateItemPedidoDto[];
}
