import { Test, TestingModule } from '@nestjs/testing';
import { PedidoManualService } from './pedido-manual.service';

describe('PedidoManualService', () => {
  let service: PedidoManualService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PedidoManualService],
    }).compile();

    service = module.get<PedidoManualService>(PedidoManualService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
