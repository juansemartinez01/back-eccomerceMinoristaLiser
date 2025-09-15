import { IsInt, IsNotEmpty, IsOptional, IsString, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

export class ItemPedidoWebDto {
  @IsInt() producto_id: number;
  @IsInt() cantidad: number; // unidades o gramos según producto
}

export class ContactoWebDto {
  @IsString() @IsNotEmpty() nombre: string;
  @IsString() @IsNotEmpty() telefono: string;
  @IsString() @IsNotEmpty() direccion: string;
  @IsOptional() @IsString() email?: string;
  @IsOptional() @IsString() notas?: string;
}

export class CrearPedidoWebDto {
  @ValidateNested({ each: true })
  @Type(() => ItemPedidoWebDto)
  @ArrayMinSize(1)
  items: ItemPedidoWebDto[];

  @ValidateNested()
  @Type(() => ContactoWebDto)
  contacto: ContactoWebDto;
}
