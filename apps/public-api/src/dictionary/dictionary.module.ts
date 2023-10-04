import { Module } from '@nestjs/common';
import { DictionaryService } from './services/dictionary/dictionary.service';
import { AutomapperModule } from '@automapper/nestjs';
import { DictionaryValueDbModule } from '@haus/db-common/dictionary-value/dictionary-value-db.module';
import { DbCommonModule } from '@haus/db-common';

@Module({
    imports: [AutomapperModule, DbCommonModule, AutomapperModule],
    providers: [DictionaryService],
    exports: [DictionaryService]
})
export class DictionaryModule {}
