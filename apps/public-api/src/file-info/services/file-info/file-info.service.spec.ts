import { Test, TestingModule } from '@nestjs/testing';
import { FileInfoService } from './file-info.service';

describe('FileInfoService', () => {
    let service: FileInfoService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [FileInfoService]
        }).compile();

        service = module.get<FileInfoService>(FileInfoService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
