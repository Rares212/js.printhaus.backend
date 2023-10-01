import { Module } from '@nestjs/common';
import { DictionaryValue } from '@haus/db-common/dictionary-value/model/dictionary-value';
import { DictionaryValueProfile } from '@haus/db-common/dictionary-value/model/dictionary-value.profile';
import { DictionaryValueRepo } from '@haus/db-common/dictionary-value/repo/dictionary-value.repo';
import { TypegooseModule } from 'nestjs-typegoose';

@Module({
    imports: [TypegooseModule.forFeature([DictionaryValue])],
    providers: [DictionaryValueProfile, DictionaryValueRepo]
})
export class DictionaryValueModule {}
