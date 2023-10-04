import { Body, Controller, Get, HttpCode, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { PrintProcessingService } from '../../services/print-processing/print-processing.service';
import { PrintMaterialDto, PrintModelDetailsRespDto } from '@printhaus/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PrintMaterialService } from '../../services/print-material/print-material.service';
import { PrintModelDetailsReqDto } from '../../models/print-model-details.req.dto';

@Controller('print')
export class PrintController {
    constructor(
        private printService: PrintProcessingService,
        private printMaterialService: PrintMaterialService
    ) {}

    @Get('/materials')
    public getPublicMaterialList(): Promise<PrintMaterialDto[]> {
        return this.printMaterialService.getPublicMaterialList();
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
