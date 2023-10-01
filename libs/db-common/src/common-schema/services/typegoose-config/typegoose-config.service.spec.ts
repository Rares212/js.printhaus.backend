import { Test, TestingModule } from '@nestjs/testing';
import { TypegooseConfigService } from './typegoose-config.service';

describe('TypegooseConfigService', () => {
  let service: TypegooseConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TypegooseConfigService],
    }).compile();

    service = module.get<TypegooseConfigService>(TypegooseConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
