import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { PrintMaterial } from '@haus/db-common/print-material/model/print-material';
import { PrintMaterialRepo } from '@haus/db-common/print-material/repo/print-material.repo';
import { PrintMaterialProfile } from '@haus/db-common/print-material/model/print-material.profile';

@Module({
    imports: [TypegooseModule.forFeature([PrintMaterial])],
    providers: [PrintMaterialRepo, PrintMaterialProfile],
    exports: [PrintMaterialProfile, PrintMaterialRepo, TypegooseModule]
})
export class PrintMaterialDbModule {}
