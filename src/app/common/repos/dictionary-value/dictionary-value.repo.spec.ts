import { Test, TestingModule } from '@nestjs/testing';
import { DictionaryValueRepo } from './dictionary-value.repo';

describe('DictionaryValueRepoService', () => {
  let service: DictionaryValueRepo;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DictionaryValueRepo],
    }).compile();

    service = module.get<DictionaryValueRepo>(DictionaryValueRepo);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
