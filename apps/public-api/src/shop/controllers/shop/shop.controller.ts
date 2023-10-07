import { Controller, Get } from "@nestjs/common";
import { ShopItemService } from "../../services/shop-item/shop-item.service";
import { ShopItemDto } from "@printhaus/common";

@Controller('shop')
export class ShopController {
    constructor(private readonly shopItemService: ShopItemService) {
    }

    @Get('items')
    public getShopItems(): Promise<ShopItemDto[]> {
        return this.shopItemService.getShopItemList();
    }
}
