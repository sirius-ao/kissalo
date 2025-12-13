import { Test, TestingModule } from '@nestjs/testing';
import { ProfissionalsService } from './profissionals.service';

describe('ProfissionalsService', () => {
  let service: ProfissionalsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProfissionalsService],
    }).compile();

    service = module.get<ProfissionalsService>(ProfissionalsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
