import { Test, TestingModule } from '@nestjs/testing';
import { ProfissionalsController } from './profissionals.controller';
import { ProfissionalsService } from './profissionals.service';

describe('ProfissionalsController', () => {
  let controller: ProfissionalsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfissionalsController],
      providers: [ProfissionalsService],
    }).compile();

    controller = module.get<ProfissionalsController>(ProfissionalsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
