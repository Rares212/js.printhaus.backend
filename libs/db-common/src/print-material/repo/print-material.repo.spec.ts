import { Test, TestingModule } from '@nestjs/testing';
import { PrintMaterialRepo } from './print-material.repo';

describe('PrintMaterialService', () => {
    let service: PrintMaterialRepo;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [PrintMaterialRepo]
        }).compile();

        service = module.get<PrintMaterialRepo>(PrintMaterialRepo);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
