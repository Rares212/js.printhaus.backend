import { Module } from '@nestjs/common';
import { TypegooseConfigService } from '@haus/db-common/common-schema/services/typegoose-config/typegoose-config.service';

@Module({
    providers: [TypegooseConfigService]
})
export class CommonSchemaModule {}
