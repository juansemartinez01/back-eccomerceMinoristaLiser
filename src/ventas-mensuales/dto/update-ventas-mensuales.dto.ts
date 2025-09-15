import { PartialType } from '@nestjs/mapped-types';
import { CreateVentasMensualesDto } from './create-ventas-mensuales.dto';

export class UpdateVentasMensualesDto extends PartialType(CreateVentasMensualesDto) {}