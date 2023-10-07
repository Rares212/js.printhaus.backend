import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { ShopItem } from '@haus/db-common/shop-item/model/shop.item';
import { ShopItemRepo } from '@haus/db-common/shop-item/repo/shop-item.repo';
import { ShopItemProfile } from '@haus/db-common/shop-item/model/shop-item.profile';

@Module({
    imports: [TypegooseModule.forFeature([ShopItem])],
    providers: [ShopItemRepo, ShopItemProfile],
    exports: [ShopItemProfile, ShopItemRepo, TypegooseModule]
})
export class ShopItemDbModule {}
