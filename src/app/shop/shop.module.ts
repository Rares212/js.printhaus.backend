import { Module } from '@nestjs/common';
import { PrintCostService } from './services/print-cost/print-cost.service';
import { ExchangeRateService } from './services/exchange-rate/exchange-rate.service';

@Module({
  providers: [PrintCostService, ExchangeRateService]
})
export class ShopModule {}
