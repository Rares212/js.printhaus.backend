import { Module } from '@nestjs/common';
import { PrintController } from './controllers/print/print.controller';
import { PrintProcessingService } from './services/print-processing/print-processing.service';
import { PrintMaterialRepo } from './repos/print-material/print-material.repo';
import { PrintCostService } from '../shop/services/print-cost/print-cost.service';
import { SchemaModule } from '../common/schema/schema.module';
import { PrintMaterialProfile } from '@src/app/printing/models/print-material.profile';
import { PrintMaterialTypeProfile } from '@src/app/printing/models/print-material-type.profile';
import { CommonModule } from '@src/app/common/common.module';
import { PrintMaterialService } from "@src/app/printing/services/print-material/print-material.service";
import { PrintMaterialTypeRepo } from "@src/app/printing/repos/print-material-type/print-material-type.repo";

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
