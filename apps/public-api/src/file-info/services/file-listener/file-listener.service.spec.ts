import { Test, TestingModule } from '@nestjs/testing';
import { FileListenerService } from './file-listener.service';

describe('FileListenerService', () => {
    let service: FileListenerService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [FileListenerService]
        }).compile();

        service = module.get<FileListenerService>(FileListenerService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
