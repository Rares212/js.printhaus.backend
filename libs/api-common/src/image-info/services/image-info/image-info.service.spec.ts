import { Test, TestingModule } from '@nestjs/testing';
import { ImageInfoService } from './image-info.service';

describe('ImageInfoService', () => {
  let service: ImageInfoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImageInfoService],
    }).compile();

    service = module.get<ImageInfoService>(ImageInfoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
