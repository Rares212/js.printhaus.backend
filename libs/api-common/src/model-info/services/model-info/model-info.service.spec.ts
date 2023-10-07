import { Test, TestingModule } from '@nestjs/testing';
import { ModelInfoService } from './model-info.service';

describe('ModelInfoService', () => {
  let service: ModelInfoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ModelInfoService],
    }).compile();

    service = module.get<ModelInfoService>(ModelInfoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
