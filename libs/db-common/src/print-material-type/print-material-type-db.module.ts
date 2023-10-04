import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { PrintMaterialType } from '@haus/db-common/print-material-type/model/print-material-type';
import { PrintMaterialTypeProfile } from '@haus/db-common/print-material-type/model/print-material-type.profile';
import { PrintMaterialTypeRepo } from '@haus/db-common/print-material-type/repo/print-material-type.repo';

@Module({
    imports: [TypegooseModule.forFeature([PrintMaterialType])],
    providers: [PrintMaterialTypeRepo, PrintMaterialTypeProfile],
    exports: [PrintMaterialTypeRepo, TypegooseModule]
})
export class PrintMaterialTypeDbModule {}
