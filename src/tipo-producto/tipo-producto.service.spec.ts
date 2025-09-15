import { Test, TestingModule } from '@nestjs/testing';
import { TipoProductoService } from './tipo-producto.service';

describe('TipoProductoService', () => {
  let service: TipoProductoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TipoProductoService],
    }).compile();

    service = module.get<TipoProductoService>(TipoProductoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
