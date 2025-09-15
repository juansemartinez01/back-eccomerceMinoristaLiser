import { Test, TestingModule } from '@nestjs/testing';
import { PrecioProductoListaService } from './precio-producto-lista.service';

describe('PrecioProductoListaService', () => {
  let service: PrecioProductoListaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrecioProductoListaService],
    }).compile();

    service = module.get<PrecioProductoListaService>(PrecioProductoListaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
