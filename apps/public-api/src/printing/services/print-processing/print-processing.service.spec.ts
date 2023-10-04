import { Test, TestingModule } from '@nestjs/testing';
import { PrintProcessingService } from './print-processing.service';

describe('PrintProcessingService', () => {
    let service: PrintProcessingService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [PrintProcessingService]
        }).compile();

        service = module.get<PrintProcessingService>(PrintProcessingService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
