import { Test, TestingModule } from '@nestjs/testing';
import { MovimientoCuentaCorrienteService } from './movimiento-cuenta-corriente.service';

describe('MovimientoCuentaCorrienteService', () => {
  let service: MovimientoCuentaCorrienteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MovimientoCuentaCorrienteService],
    }).compile();

    service = module.get<MovimientoCuentaCorrienteService>(MovimientoCuentaCorrienteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
