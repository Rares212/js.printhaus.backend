import { Module } from '@nestjs/common';
import { PrintCostService } from './services/print-cost/print-cost.service';
import { ExchangeRateService } from './services/exchange-rate/exchange-rate.service';
import { DictionaryModule } from '../dictionary/dictionary.module';

@Module({
    imports: [DictionaryModule],
    providers: [PrintCostService, ExchangeRateService]
})
export class ShopModule {}
