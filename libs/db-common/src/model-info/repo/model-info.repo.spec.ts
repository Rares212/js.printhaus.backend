import { Test, TestingModule } from '@nestjs/testing';
import { ModelInfoRepo } from './model-info.repo';

describe('ModelInfoRepo', () => {
  let service: ModelInfoRepo;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ModelInfoRepo],
    }).compile();

    service = module.get<ModelInfoRepo>(ModelInfoRepo);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
