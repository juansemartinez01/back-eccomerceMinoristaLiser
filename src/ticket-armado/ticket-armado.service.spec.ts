import { Test, TestingModule } from '@nestjs/testing';
import { TicketArmadoService } from './ticket-armado.service';

describe('TicketArmadoService', () => {
  let service: TicketArmadoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TicketArmadoService],
    }).compile();

    service = module.get<TicketArmadoService>(TicketArmadoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
