import { Test, TestingModule } from '@nestjs/testing';
import { UserRatingRepo } from './user-rating.repo';

describe('UserRatingService', () => {
  let service: UserRatingRepo;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserRatingRepo],
    }).compile();

    service = module.get<UserRatingRepo>(UserRatingRepo);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
