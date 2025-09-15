import { Test, TestingModule } from '@nestjs/testing';
import { ConfiguracionHorariaService } from './configuracion-horaria.service';

describe('ConfiguracionHorariaService', () => {
  let service: ConfiguracionHorariaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfiguracionHorariaService],
    }).compile();

    service = module.get<ConfiguracionHorariaService>(ConfiguracionHorariaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
