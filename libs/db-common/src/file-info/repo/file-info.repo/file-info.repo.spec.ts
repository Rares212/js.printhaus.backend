import { Test, TestingModule } from '@nestjs/testing';
import { FileInfoRepo } from './file-info.repo';

describe('FileInfoRepo', () => {
    let service: FileInfoRepo;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [FileInfoRepo]
        }).compile();

        service = module.get<FileInfoRepo>(FileInfoRepo);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
