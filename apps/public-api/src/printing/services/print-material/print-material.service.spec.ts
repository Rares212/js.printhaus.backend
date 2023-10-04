import { Test, TestingModule } from '@nestjs/testing';
import { PrintMaterialService } from './print-material.service';

describe('PrintMaterialService', () => {
    let service: PrintMaterialService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [PrintMaterialService]
        }).compile();

        service = module.get<PrintMaterialService>(PrintMaterialService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
