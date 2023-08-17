import { Test, TestingModule } from '@nestjs/testing';
import { PrintMaterialTypeRepo } from './print-material-type.repo';

describe('PrintMaterialTypeRepoService', () => {
  let service: PrintMaterialTypeRepo;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrintMaterialTypeRepo],
    }).compile();

    service = module.get<PrintMaterialTypeRepo>(PrintMaterialTypeRepo);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
