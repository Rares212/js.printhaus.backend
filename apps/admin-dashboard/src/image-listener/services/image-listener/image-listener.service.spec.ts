import { Test, TestingModule } from '@nestjs/testing';
import { ImageListenerService } from './image-listener.service';

describe('ImageListenerService', () => {
  let service: ImageListenerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImageListenerService],
    }).compile();

    service = module.get<ImageListenerService>(ImageListenerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
