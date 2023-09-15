import { Test, TestingModule } from '@nestjs/testing';
import { ShopItemService } from './shop-item.service';

describe('ShopItemService', () => {
  let service: ShopItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShopItemService],
    }).compile();

    service = module.get<ShopItemService>(ShopItemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
