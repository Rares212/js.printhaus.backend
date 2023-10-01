import { Module } from '@nestjs/common';
import { PrintController } from './controllers/print/print.controller';
import { PrintProcessingService } from './services/print-processing/print-processing.service';
import { PrintMaterialRepo } from '@haus/db-common/db-common/print-material/repo/print-material.repo';
import { PrintCostService } from '../shop/services/print-cost/print-cost.service';
import { SchemaModule } from '../common/schema/schema.module';
import { PrintMaterialProfile } from '@src/printing/models/print-material.profile';
import { PrintMaterialTypeProfile } from '@src/printing/models/print-material-type.profile';
import { CommonModule } from '@src/common/common.module';
import { PrintMaterialService } from "@src/printing/services/print-material/print-material.service";
import { PrintMaterialTypeRepo } from "@src/printing/repos/print-material-type/print-material-type.repo";

@Module({
    controllers: [PrintController],
    providers: [
        PrintProcessingService,
        PrintCostService,

        PrintMaterialRepo,
        PrintMaterialProfile,
        PrintMaterialService,

        PrintMaterialTypeRepo,
        PrintMaterialTypeProfile,
    ],
    imports: [CommonModule, SchemaModule]
})
export class PrintingModule {}
