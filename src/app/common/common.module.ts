import { Module } from '@nestjs/common';
import { AdminConfigService } from './services/admin-config/admin-config.service';
import {ConfigModule} from "@nestjs/config";
import { TypegooseConfigService } from './services/typegoose-config/typegoose-config.service';
import { SchemaModule } from './schema/schema.module';

@Module({
  imports: [
      ConfigModule,
      SchemaModule
  ],
  providers: [
      AdminConfigService,
      TypegooseConfigService
  ]
})
export class CommonModule {}
