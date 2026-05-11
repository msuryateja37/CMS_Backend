import { Controller, Post, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { OcrService } from './ocr.service';

@Controller('ocr-scan')
export class OcrController {
  constructor(private readonly ocrService: OcrService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async scanFile(@UploadedFile() file: any) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const allowedMimeTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/tiff'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type. Only PDF and images are allowed.');
    }

    return await this.ocrService.scanInvoice(file.buffer);
  }
}