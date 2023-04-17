import { Module } from '@nestjs/common';
import { PrintController } from './controllers/print/print.controller';
import { PrintProcessingService } from './services/print-processing/print-processing.service';

@Module({
  controllers: [PrintController],
  providers: [PrintProcessingService]
})
export class PrintingModule {}
