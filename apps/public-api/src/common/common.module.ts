import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypegooseConfigService } from '@haus/db-common/common-schema/services/typegoose-config/typegoose-config.service';
import { SchemaModule } from './schema/schema.module';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { PrintMaterialProfile } from '@src/printing/models/print-material.profile';
import { DictionaryValueProfile } from '@src/dictionary/models/dictionary-value.profile';
import { FileInfoProfile } from '@src/haus-file/models/file-info.profile';
import { AwsS3Service } from "@src/haus-file-storage/services/aws-s3/aws-s3.service";
import { DictionaryService } from "@src/dictionary/services/dictionary/dictionary.service";
import { DictionaryValueRepo } from "@src/dictionary/repos/dictionary-value/dictionary-value.repo";

@Module({
  imports: [
    ConfigModule,
    SchemaModule,
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
  ],
  exports: [
    AwsS3Service,

    DictionaryService,
    DictionaryValueRepo,
  ],
  providers: [
    AwsS3Service,

    DictionaryService,
    DictionaryValueRepo,
    DictionaryValueProfile,

    TypegooseConfigService,
  ],
})
export class CommonModule {}
