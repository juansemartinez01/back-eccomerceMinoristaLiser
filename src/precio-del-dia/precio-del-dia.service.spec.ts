import { Test, TestingModule } from '@nestjs/testing';
import { PrecioDelDiaService } from './precio-del-dia.service';

describe('PrecioDelDiaService', () => {
  let service: PrecioDelDiaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrecioDelDiaService],
    }).compile();

    service = module.get<PrecioDelDiaService>(PrecioDelDiaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
