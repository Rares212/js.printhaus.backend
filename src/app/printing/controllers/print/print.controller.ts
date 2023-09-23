import { Body, Controller, Get, HttpCode, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { PrintProcessingService } from '../../services/print-processing/print-processing.service';
import { PrintModelDetailsReqDto } from '@src/app/printing/models/print-model-details.req.dto';
import { PrintMaterialDto, PrintModelDetailsRespDto } from '@printnuts/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PrintMaterialService } from '@src/app/printing/services/print-material/print-material.service';

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
