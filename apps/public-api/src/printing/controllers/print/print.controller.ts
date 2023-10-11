import { Body, Controller, Get, HttpCode, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { PrintProcessingService } from '../../services/print-processing/print-processing.service';
import { DictionaryKey, PrintDimensionsDto, PrintMaterialDto, PrintModelDetailsRespDto } from '@printhaus/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PrintMaterialService } from '../../services/print-material/print-material.service';
import { PrintModelDetailsReqDto } from '../../models/print-model-details.req.dto';
import { DictionaryService } from '../../../dictionary/services/dictionary/dictionary.service';

@Controller('print')
export class PrintController {
    constructor(
        private printService: PrintProcessingService,
        private printMaterialService: PrintMaterialService,
        private dictionaryService: DictionaryService
    ) {}

    @Get('/materials')
    public getPublicMaterialList(): Promise<PrintMaterialDto[]> {
        return this.printMaterialService.getPublicMaterialList();
    }

    @Get('/print-bed-dimensions')
    public async getPrintBedDimensions(): Promise<PrintDimensionsDto> {
        return JSON.parse((await this.dictionaryService.findByKey(DictionaryKey.PRINT_BED_DIMENSIONS)).value);
    }

    @Post('/model-details')
    @HttpCode(200)
    @UseInterceptors(FileInterceptor('compressedMeshFile'))
    public getModelDetails(
        @UploadedFile() file: Express.Multer.File,
        @Body() modelDetailsRequest: PrintModelDetailsReqDto
    ): Promise<PrintModelDetailsRespDto> {
        return this.printService.getModelDetails(file, modelDetailsRequest);
    }
}
