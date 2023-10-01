import { Test, TestingModule } from '@nestjs/testing';
import { PrintCostService } from './print-cost.service';

describe('PrintCostService', () => {
  let service: PrintCostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrintCostService],
    }).compile();

    service = module.get<PrintCostService>(PrintCostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
