import { Module } from '@nestjs/common';
import { PrintController } from './controllers/print/print.controller';
import { PrintProcessingService } from './services/print-processing/print-processing.service';
import { PrintCostService } from '../shop/services/print-cost/print-cost.service';
import { DictionaryModule } from '../dictionary/dictionary.module';
import { AutomapperModule } from '@automapper/nestjs';
import { PrintMaterialDbModule } from '@haus/db-common/print-material/print-material-db.module';
import { PrintMaterialTypeDbModule } from '@haus/db-common/print-material-type/print-material-type-db.module';
import { DbCommonModule } from '@haus/db-common';
import { PrintMaterialService } from './services/print-material/print-material.service';

@Module({
    controllers: [PrintController],
    providers: [PrintMaterialService, PrintProcessingService, PrintCostService],
    imports: [DictionaryModule, DbCommonModule, AutomapperModule]
})
export class PrintingModule {}
