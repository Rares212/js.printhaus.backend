import { Test, TestingModule } from '@nestjs/testing';
import { ShopItemRepo } from './shop-item.repo';

describe('ShopItemRepoService', () => {
  let service: ShopItemRepo;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShopItemRepo],
    }).compile();

    service = module.get<ShopItemRepo>(ShopItemRepo);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
