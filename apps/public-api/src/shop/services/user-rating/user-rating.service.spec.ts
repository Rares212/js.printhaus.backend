import { Test, TestingModule } from '@nestjs/testing';
import { UserRatingService } from './user-rating.service';

describe('UserRatingService', () => {
  let service: UserRatingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserRatingService],
    }).compile();

    service = module.get<UserRatingService>(UserRatingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
