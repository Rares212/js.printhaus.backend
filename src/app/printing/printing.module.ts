import { Module } from '@nestjs/common';
import { PrintController } from './controllers/print/print.controller';
import { PrintProcessingService } from './services/print-processing/print-processing.service';
import { PrintMaterialRepo } from './repos/print-material/print-material.repo';
import {PrintCostService} from "../shop/services/print-cost/print-cost.service";
import {SchemaModule} from "../common/schema/schema.module";

@Module({
  controllers: [PrintController],
  providers: [PrintProcessingService, PrintMaterialRepo, PrintCostService],
  imports: [
      SchemaModule
  ]
})
export class PrintingModule {}
