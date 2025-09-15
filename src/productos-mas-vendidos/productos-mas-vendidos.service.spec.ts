import { Test, TestingModule } from '@nestjs/testing';
import { ProductosMasVendidosService } from './productos-mas-vendidos.service';

describe('ProductosMasVendidosService', () => {
  let service: ProductosMasVendidosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductosMasVendidosService],
    }).compile();

    service = module.get<ProductosMasVendidosService>(ProductosMasVendidosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
