import { Test, TestingModule } from '@nestjs/testing';
import { VentasMensualesService } from './ventas-mensuales.service';

describe('VentasMensualesService', () => {
  let service: VentasMensualesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VentasMensualesService],
    }).compile();

    service = module.get<VentasMensualesService>(VentasMensualesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
