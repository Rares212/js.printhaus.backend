import { Module } from '@nestjs/common';
import { ModelInfoRepo } from './repo/model-info.repo';
import { TypegooseModule } from 'nestjs-typegoose';
import { ModelInfo } from '@haus/db-common/model-info/model/model-info';

@Module({
    imports: [TypegooseModule.forFeature([ModelInfo])],
    providers: [ModelInfoRepo],
    exports: [ModelInfoRepo, TypegooseModule]
})
export class ModelInfoDbModule {}
