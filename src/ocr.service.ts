import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentAnalysisClient, AzureKeyCredential, AnalyzedDocument, DocumentField } from '@azure/ai-form-recognizer';

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
      const { documents } = await poller.pollUntilDone();

      if (!documents || documents.length === 0) {
        return { success: false, message: 'No structured data could be extracted.' };
      }

      // The first document is the invoice
      const invoice = documents[0];
      const fields = invoice.fields;
 
      // Helper to safely get currency amount
      const getCurrency = (field?: DocumentField): number => {
        if (field?.kind === 'currency' && field.value) {
          return field.value.amount;
        }
        // Fallback: forcefully extract number from raw string content if Azure missed the type
        if (field?.content) {
          const parsed = parseFloat(field.content.replace(/[^0-9.-]+/g, ""));
          if (!isNaN(parsed)) return parsed;
        }
        return 0;
      };

      // Helper to safely get a date as a YYYY-MM-DD string
      const getDate = (field?: DocumentField): string => {
        if (field?.kind === 'date' && field.value) {
          return field.value.toISOString().split('T')[0];
        }
        // Fallback for dates parsed as strings
        if (field?.content) {
          try {
            const d = new Date(field.content);
            if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
          } catch {
            // ignore
          }
          return field.content; // Return raw content if parsing fails
        }
        return '';
      };

      const utilities = (fields.Items?.kind === 'array' ? fields.Items.values : []).map((item: DocumentField) => {
        const lineItemFields = item.kind === 'object' ? item.properties : {};
        const exclVat = getCurrency(lineItemFields.Amount);
        const vat = getCurrency(lineItemFields.Tax);
        const quantity = lineItemFields.Quantity?.kind === 'number' ? lineItemFields.Quantity.value : 0;
        const unit = lineItemFields.Unit?.content ?? '';

        return {
          category: lineItemFields.Description?.content ?? '',
          meterNo: lineItemFields.ProductCode?.content ?? '',
          period: lineItemFields.Date?.content ?? '', // Often captured in Date field
          consumption: quantity ? `${quantity} ${unit}`.trim() : '',
          exclVat: exclVat,
          vat: vat,
          lineTotal: getCurrency(lineItemFields.Total) || (exclVat + vat),
        };
      });

      const parsedDate = getDate(fields.InvoiceDate);
      let billingMonth = '';
      if (parsedDate) {
        const d = new Date(parsedDate);
        if (!isNaN(d.getTime())) {
          billingMonth = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        }
      }

      // Extract bank info from PaymentDetails if Azure found them
      let bankName = '';
      let bankAccount = '';
      if (fields.PaymentDetails?.kind === 'array' && fields.PaymentDetails.values?.length > 0) {
        const paymentDetails = fields.PaymentDetails.values[0];
        if (paymentDetails.kind === 'object') {
           bankName = paymentDetails.properties?.BankName?.content ?? '';
           bankAccount = paymentDetails.properties?.AccountNumber?.content ?? paymentDetails.properties?.IBAN?.content ?? '';
        }
      }

      const totalVat = getCurrency(fields.TotalTax);
      const totalAmount = getCurrency(fields.InvoiceTotal);
      // SubTotal fallback calculation (Amount - VAT) if SubTotal explicitly doesn't exist
      const totalExclVat = getCurrency(fields.SubTotal) || (totalAmount - totalVat);

      return {
        id: 'INV-OCR-001', // Placeholder ID
        invoiceNumber: fields.InvoiceId?.content ?? '',
        invoiceDate: parsedDate,
        billingMonth: billingMonth,
        landlordName: fields.VendorName?.content ?? fields.CustomerName?.content ?? '',
        vatNumber: fields.VendorTaxId?.content ?? fields.CustomerTaxId?.content ?? '',
        bankName: bankName,
        bankAccount: bankAccount,
        propertyName: fields.ServiceAddressRecipient?.content ?? fields.CustomerName?.content ?? '',
        propertyAddress: fields.ServiceAddress?.content ?? fields.CustomerAddress?.content ?? fields.BillingAddress?.content ?? '',
        utilities: utilities,
        refuse: {}, // Not a standard field, returned as empty object
        totalExclVat: Number(totalExclVat.toFixed(2)),
        totalVat: totalVat,
        totalAmount: totalAmount,
        basAllocations: [], // Application-specific, returned as empty array
        status: 'Draft', // Application-specific default
        currentStep: 1, // Application-specific default
      };
    } catch (error) {
      this.logger.error(`Error during OCR scan: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to process document');
    }
  }
}