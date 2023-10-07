import { Module } from '@nestjs/common';
import { PrintCostService } from './services/print-cost/print-cost.service';
import { ExchangeRateService } from './services/exchange-rate/exchange-rate.service';
import { DictionaryModule } from '../dictionary/dictionary.module';
import { ShopController } from './controllers/shop/shop.controller';
import { ShopItemService } from "./services/shop-item/shop-item.service";
import { DbCommonModule } from "@haus/db-common";
import { ImageInfoModule } from "@haus/api-common/image-info/image-info.module";
import { ModelInfoModule } from "@haus/api-common/model-info/model-info.module";
import { UserRatingService } from "./services/user-rating/user-rating.service";
import { AutomapperModule } from "@automapper/nestjs";
import { PrintingModule } from "../printing/printing.module";

@Module({
    imports: [DictionaryModule, DbCommonModule, ImageInfoModule, ModelInfoModule, PrintingModule, AutomapperModule],
    providers: [PrintCostService, ShopItemService, ExchangeRateService, UserRatingService],
    controllers: [ShopController]
})
export class ShopModule {}
