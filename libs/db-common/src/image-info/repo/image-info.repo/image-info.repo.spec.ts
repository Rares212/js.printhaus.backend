import { Test, TestingModule } from '@nestjs/testing';
import { ImageInfoRepo } from './image-info-repo.service';

describe('ImageInfoRepo', () => {
  let service: ImageInfoRepo;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImageInfoRepo],
    }).compile();

    service = module.get<ImageInfoRepo>(ImageInfoRepo);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
