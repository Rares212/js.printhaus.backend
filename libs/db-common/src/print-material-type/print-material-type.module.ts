import { Module } from '@nestjs/common';
import { TypegooseModule } from "nestjs-typegoose";
import { PrintMaterialType } from "@haus/db-common/print-material-type/model/print-material-type";
import { PrintMaterialRepo } from "@haus/db-common/print-material/repo/print-material.repo";
import { PrintMaterialTypeProfile } from "@haus/db-common/print-material-type/model/print-material-type.profile";

@Module({
    imports: [TypegooseModule.forFeature([PrintMaterialType])],
    providers: [PrintMaterialRepo, PrintMaterialTypeProfile]
})
export class PrintMaterialTypeModule {}
