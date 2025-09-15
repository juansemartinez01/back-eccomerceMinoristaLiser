import { Test, TestingModule } from '@nestjs/testing';
import { StockActualService } from './stock-actual.service';

describe('StockActualService', () => {
  let service: StockActualService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StockActualService],
    }).compile();

    service = module.get<StockActualService>(StockActualService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
