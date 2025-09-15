import { Test, TestingModule } from '@nestjs/testing';
import { MovimientoStockService } from './movimiento-stock.service';

describe('MovimientoStockService', () => {
  let service: MovimientoStockService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MovimientoStockService],
    }).compile();

    service = module.get<MovimientoStockService>(MovimientoStockService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
