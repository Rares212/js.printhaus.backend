import { Test, TestingModule } from '@nestjs/testing';
import { AuthUserRepo } from './user.repo';

describe('UserRepoService', () => {
  let service: AuthUserRepo;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthUserRepo],
    }).compile();

    service = module.get<AuthUserRepo>(AuthUserRepo);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
