import { Module } from '@nestjs/common';
import { PrintCostService } from './services/print-cost/print-cost.service';
import { ExchangeRateService } from './services/exchange-rate/exchange-rate.service';
import { CommonModule } from "@src/app/common/common.module";

@Module({
  imports: [
    CommonModule
  ],
  providers: [PrintCostService, ExchangeRateService]
})
export class ShopModule {}
