import { Test, TestingModule } from '@nestjs/testing';
import { ModelListenerService } from './model-listener.service';

describe('ModelListenerService', () => {
  let service: ModelListenerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ModelListenerService],
    }).compile();

    service = module.get<ModelListenerService>(ModelListenerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
