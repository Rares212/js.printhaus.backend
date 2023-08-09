import { Module } from '@nestjs/common';
import {ConfigModule} from "@nestjs/config";
import { TypegooseConfigService } from './services/typegoose-config/typegoose-config.service';
import { SchemaModule } from './schema/schema.module';
import {AutomapperModule} from "@automapper/nestjs";
import {classes} from "@automapper/classes";
import {PrintMaterialProfile} from "@src/app/printing/models/print-material.profile";

@Module({
  imports: [
      ConfigModule,
      SchemaModule,
      AutomapperModule.forRoot({
          strategyInitializer: classes(),
      })
  ],
  providers: [
      TypegooseConfigService,
      PrintMaterialProfile
  ]
})
export class CommonModule {}
