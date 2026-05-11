import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentAnalysisClient, AzureKeyCredential } from '@azure/ai-form-recognizer';

@Injectable()
export class OcrService {
  private readonly logger = new Logger(OcrService.name);
  private client: DocumentAnalysisClient | undefined;

  constructor(private configService: ConfigService) {
    const endpoint = this.configService.get<string>('AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT');
    const apiKey = this.configService.get<string>('AZURE_DOCUMENT_INTELLIGENCE_KEY');

    if (endpoint && apiKey) {
      this.client = new DocumentAnalysisClient(endpoint, new AzureKeyCredential(apiKey));
    } else {
      this.logger.warn('Azure Document Intelligence configuration is missing.');
    }
  }

  async scanInvoice(fileBuffer: Buffer) {
    if (!this.client) {
      throw new BadRequestException('OCR service is not configured');
    }

    try {
      // Use the prebuilt-invoice model to extract data from bills/invoices
      const poller = await this.client.beginAnalyzeDocument("prebuilt-invoice", fileBuffer);
      const response = await poller.pollUntilDone();

      return response;
    } catch (error) {
      this.logger.error(`Error during OCR scan: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to process document');
    }
  }
}