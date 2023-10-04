import { Module } from '@nestjs/common';
import { AdminModule } from '@adminjs/nestjs';

@Module({
    imports: [

    ],
    exports: [AdminModule]
})
export class AdminConfigModule {}
