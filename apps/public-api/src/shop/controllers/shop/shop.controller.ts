import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { ShopItemService } from "../../services/shop-item/shop-item.service";
import { PaginatedRequestDto, ShopItemDto } from "@printhaus/common";

@Controller('shop')
export class ShopController {
    constructor(private readonly shopItemService: ShopItemService) {
    }

    @Post('items')
    public getShopItems(@Body() pagination: PaginatedRequestDto): Promise<ShopItemDto[]> {
        return this.shopItemService.getShopItemList(pagination);
    }

    @Get('item-count')
    public getShopItemCount(): Promise<number> {
        return this.shopItemService.getShopItemCount();
    }

    @Get('item/model-signed-url')
    public getModelSignedUrl(@Query('id') id: string): Promise<string> {
        return this.shopItemService.getShopItemModelUrl(id);
    }
}
