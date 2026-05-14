import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AzureKeyCredential,
  DocumentAnalysisClient,
} from '@azure/ai-form-recognizer';

@Injectable()
export class OcrService {
  private readonly logger = new Logger(OcrService.name);

  private client: DocumentAnalysisClient;

  constructor(
    private readonly configService: ConfigService,
  ) {
    const endpoint =
      this.configService.get<string>(
        'AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT',
      );

    const key =
      this.configService.get<string>(
        'AZURE_DOCUMENT_INTELLIGENCE_KEY',
      );

    if (!endpoint || !key) {
      this.logger.warn(
        'Azure OCR configuration missing. OCR features will be unavailable.',
      );
    } else {
      this.client = new DocumentAnalysisClient(
        endpoint,
        new AzureKeyCredential(key),
      );
    }
  }

  async scanInvoice(fileBuffer: Buffer) {
    if (!this.client) {
      throw new BadRequestException('OCR service is not configured');
    }
    try {
      /**
       * OCR
       */

      const poller =
        await this.client.beginAnalyzeDocument(
          'prebuilt-layout',
          fileBuffer,
        );

      const result =
        await poller.pollUntilDone();

      /**
       * FULL TEXT
       */

      const fullText =
        result.pages
          ?.flatMap(
            (p) =>
              p.lines?.map((l) => l.content) ||
              [],
          )
          .join('\n') || '';

      this.logger.debug(
        `OCR full text:\n${fullText}`,
      );

      /**
       * HELPERS
       */

      const extract = (
        regex: RegExp,
        fallback = 'N/A',
      ) => {
        const match =
          fullText.match(regex);

        return (
          match?.[1]?.trim() || fallback
        );
      };

      const extractNumber = (
        regex: RegExp,
        fallback = 0,
      ) => {
        const match =
          fullText.match(regex);

        if (!match?.[1]) return fallback;

        const value = parseFloat(
          match[1].replace(/[,\s]/g, ''),
        );

        return isNaN(value)
          ? fallback
          : Number(value.toFixed(2));
      };

      const normalize = (
        value: string,
      ) =>
        value
          .replace(/\s+/g, ' ')
          .trim();

      /**
       * SECTION SPLITTER — Page 2 has distinct sections per service
       * Each section starts with a provider header and ends at the next one
       */

      const extractSection = (
        sectionStart: RegExp,
        sectionEnd: RegExp | null,
      ): string => {
        const startMatch =
          fullText.match(sectionStart);

        if (!startMatch) return '';

        const startIdx =
          startMatch.index! +
          startMatch[0].length;

        if (sectionEnd) {
          const remaining =
            fullText.slice(startIdx);

          const endMatch =
            remaining.match(sectionEnd);

          if (endMatch) {
            return fullText.slice(
              startMatch.index!,
              startIdx + endMatch.index!,
            );
          }
        }

        return fullText.slice(
          startMatch.index!,
        );
      };

      /**
       * Extract the last number on its own line in a section
       * (which is typically the section total)
       */
      const extractSectionTotal = (
        section: string,
      ): number => {
        // Match the last standalone number in the section
        // COJ invoices have the total as the last number in each section
        const numbers = [
          ...section.matchAll(
            /^[\s]*([0-9][0-9,]*\.[0-9]{2})[\s]*$/gm,
          ),
        ];

        if (numbers.length === 0)
          return 0;

        const lastNum =
          numbers[numbers.length - 1][1];

        return parseFloat(
          lastNum.replace(/,/g, ''),
        );
      };


      const extractSectionVat = (
        section: string,
      ): number => {
        const vatMatch = section.match(
          /VAT:\s*15\.00%\s*\n\s*([0-9,]+\.[0-9]{2})/,
        );

        if (vatMatch) {
          return parseFloat(
            vatMatch[1].replace(/,/g, ''),
          );
        }

        return 0;
      };

      /**
       * BASIC DETAILS
       */

      const invoiceNumber = extract(
        /Invoice Number[:\s]+([0-9]+)/i,
      );

      const invoiceDate = extract(
        /Date\s+([0-9/\-]+)/i,
      );

      const billingMonth = extract(
        /Statement for\s+([A-Za-z]+\s+[0-9]{4})/i,
      );

      const landlordName = normalize(
        extract(
          /TAX INVOICE\s+([\s\S]*?)(?:\n\d+\/|\n32\/)/i,
        ),
      );

      const propertyName = extract(
        /Physical Address\s+(.+)/i,
      );

      const propertyAddress = extract(
        /Township\s+(.+)/i,
      );

      // COJ invoices list multiple VAT numbers — grab the City of Johannesburg one
      const vatNumber = extract(
        /VAT NO:\s*CITY OF JOHANNESBURG:\s*([0-9]+)/i,
        extract(
          /VAT NO[:\sA-Z]*?([0-9]{10})/i,
        ),
      );

      /**
       * PROPERTY DETAILS
       */

      const buildingSize =
        extractNumber(
          /Stand Size\s+([0-9]+)/i,
        );

      const leasedArea = 0;

      const proRataShare = 0;

      const paymentMethod =
        'EFT';

      /**
       * BANKING
       * Note: CIN no AA45 is the Standard Bank branch CIN, NOT the account number
       * The actual account number is "Account Number: 556259155"
       */

      const bankName =
        extract(
          /(NEDBANK|ABSA|FNB|STANDARD BANK|CAPITEC)/i,
          'City of Johannesburg Banking',
        );

      const bankAccount =
        extract(
          /Account Number[:\s]+([0-9]+)/i,
          extract(
            /Acc\.\s*No\.?[:\s]+([0-9]+)/i,
          ),
        );

      /**
       * SECTION-BASED EXTRACTION FOR PAGE 2 LINE ITEMS
       * COJ invoices have clearly separated sections:
       * - Property Rates (VAT 4760117194)
       * - City Power / Electricity (VAT 4710191182)
       * - Johannesburg Water / Water & Sanitation (VAT 4270191077)
       * - PIKITUP / Refuse (VAT 4790191292)
       */

      const propertyRatesSection =
        extractSection(
          /Property Rates\s*\n\s*VAT\s+4760117194/i,
          /City Power|Electricity\s*\n\s*VAT/i,
        );

      const electricitySection =
        extractSection(
          /(?:City Power\s*\n\s*)?Electricity\s*\n\s*VAT\s+4710191182/i,
          /Johannesburg Water|Water & Sanitation/i,
        );

      const waterSection =
        extractSection(
          /(?:Johannesburg Water\s*\n\s*)?Water & Sanitation\s*\n\s*VAT\s+4270191077/i,
          /PIKITUP|Refuse\s*\n\s*VAT/i,
        );

      const refuseSection =
        extractSection(
          /(?:PIKITUP\s*\n\s*)?Refuse\s*\n\s*VAT\s+4790191292/i,
          /Current Charges/i,
        );

      this.logger.debug(
        `Property Rates section:\n${propertyRatesSection}`,
      );
      this.logger.debug(
        `Electricity section:\n${electricitySection}`,
      );
      this.logger.debug(
        `Water section:\n${waterSection}`,
      );
      this.logger.debug(
        `Refuse section:\n${refuseSection}`,
      );

      /**
       * PROPERTY RATES
       * Format: charges, less rebate, VAT: 0%, then total (e.g. 800.96)
       */

      const propertyRatesTotal =
        extractSectionTotal(
          propertyRatesSection,
        );

      const propertyRatesVat = 0; // Property Rates are VAT exempt (0%)

      const propertyRatesExcl =
        propertyRatesTotal; // Since VAT = 0, excl = total

      /**
       * ELECTRICITY
       */

      const electricityTotal =
        extractSectionTotal(
          electricitySection,
        );

      const electricityVat =
        extractSectionVat(
          electricitySection,
        );

      const electricityExcl =
        Number(
          (
            electricityTotal -
            electricityVat
          ).toFixed(2),
        );

      // Check for "prepaid" FIRST — if the section says "Prepaid Electricity",
      // there's no physical meter. Otherwise the Meter regex could accidentally
      // pick up a meter number from an adjacent section if boundaries leak.
      const electricityMeterNo =
        electricitySection
          .toLowerCase()
          .includes('prepaid')
          ? 'PREPAID'
          : electricitySection.match(
              /Meter[:\s]+([A-Z0-9-]+)/i,
            )?.[1] || 'N/A';

      const electricityConsumption =
        electricitySection.match(
          /([0-9.]+\s*kWh)/i,
        )?.[1] || '0 kWh';

      /**
       * WATER & SANITATION
       */

      const waterTotal =
        extractSectionTotal(
          waterSection,
        );

      const waterVat =
        extractSectionVat(
          waterSection,
        );

      const waterExcl =
        Number(
          (
            waterTotal - waterVat
          ).toFixed(2),
        );

      const waterMeterNo =
        waterSection.match(
          /Meter:\s*([0-9A-Z-]+)/i,
        )?.[1] || 'N/A';

      const waterPeriod =
        waterSection.match(
          /Reading period\s*=\s*([0-9/]+\s*to\s*[0-9/]+)/i,
        )?.[1] || 'N/A';

      const waterConsumption =
        waterSection.match(
          /Consumption:\s*([0-9.]+;\s*\n?\s*Units:\s*[A-Z]+)/i,
        )?.[1] || 'N/A';

      /**
       * REFUSE
       */

      const refuseTotal =
        extractSectionTotal(
          refuseSection,
        );

      const refuseVat =
        extractSectionVat(
          refuseSection,
        );

      const refuseExcl =
        Number(
          (
            refuseTotal - refuseVat
          ).toFixed(2),
        );

      /**
       * TOTALS (from Page 1 summary)
       */

      // Calculate from section-level values (most reliable).
      // Property rates are VAT-exempt, so propertyRatesTotal IS the excl amount.
      const totalExclVat =
        Number(
          (
            propertyRatesExcl +
            electricityExcl +
            waterExcl +
            refuseExcl
          ).toFixed(2),
        );

      // Calculate VAT from extracted section values (most reliable).
      // The page 1 summary columns get linearized unpredictably by OCR,
      // so section-level VAT extraction is the primary source of truth.
      const totalVat =
        Number(
          (
            waterVat +
            electricityVat +
            refuseVat
          ).toFixed(2),
        );

      const totalAmount =
        extractNumber(
          /Current Charges \(Including VAT\)\s*\n?\s*([0-9,]+\.[0-9]{2})/i,
          extractNumber(
            /TOTAL AMOUNT OUTSTANDING\s*\n?\s*([0-9,]+\.[0-9]{2})/i,
            totalExclVat + totalVat,
          ),
        );

      /**
       * FINAL RESPONSE
       */

      return {
        id: 'INV-OCR-001',

        invoiceNumber,

        invoiceDate,

        billingMonth,

        landlordName,

        vatNumber,

        bankName,

        bankAccount,

        propertyName,

        propertyAddress,

        buildingSize,

        leasedArea,

        proRataShare,

        paymentMethod,

        utilities: [
          {
            category:
              'Water & Sanitation',

            meterNo:
              waterMeterNo,

            period:
              waterPeriod,

            consumption:
              waterConsumption,

            exclVat:
              waterExcl,

            vat: waterVat,

            lineTotal:
              waterTotal,
          },

          {
            category:
              'Electricity',

            meterNo:
              electricityMeterNo,

            period:
              billingMonth,

            consumption:
              electricityConsumption,

            exclVat:
              electricityExcl,

            vat:
              electricityVat,

            lineTotal:
              electricityTotal,
          },

          {
            category:
              'Property Rates',

            meterNo:
              'PROPERTY',

            period:
              billingMonth,

            consumption:
              `${buildingSize} m2`,

            exclVat:
              propertyRatesExcl,

            vat: propertyRatesVat,

            lineTotal:
              propertyRatesTotal,
          },

          {
            category:
              'Refuse',

            meterNo:
              'PIKITUP',

            period:
              billingMonth,

            consumption:
              'N/A',

            exclVat:
              refuseExcl,

            vat: refuseVat,

            lineTotal:
              refuseTotal,
          },
        ],

        refuse: {
          councilTotal:
            refuseTotal,

          proRataPercent:
            proRataShare,

          calculatedShare:
            refuseTotal,

          landlordClaimed:
            refuseTotal,

          approved: true,

          cappedAmount:
            refuseTotal,
        },

        totalExclVat,

        totalVat,

        totalAmount,

        basAllocations: [
          {
            category:
              'Electricity',

            code: '0101',

            amount:
              electricityTotal,

            objective:
              '001',

            responsibility:
              '8821',

            fund: '12',

            asset: '0000',

            item: '5411',

            infrastructure:
              'STAND-00',
          },

          {
            category:
              'Water & Sanitation',

            code: '0102',

            amount:
              waterTotal,

            objective:
              '001',

            responsibility:
              '8821',

            fund: '12',

            asset: '0000',

            item: '5412',

            infrastructure:
              'STAND-00',
          },

          {
            category:
              'Property Rates',

            code: '0103',

            amount:
              propertyRatesTotal,

            objective:
              '001',

            responsibility:
              '8821',

            fund: '12',

            asset: '0000',

            item: '5413',

            infrastructure:
              'STAND-00',
          },
        ],

        status: 'Draft',

        currentStep: 1,
      };
    } catch (error: any) {
      this.logger.error(
        error.message,
      );

      throw new BadRequestException(
        'Failed to process document',
      );
    }
  }
}