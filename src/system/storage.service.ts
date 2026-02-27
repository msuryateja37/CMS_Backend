import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private blobServiceClient: BlobServiceClient;
  private containerClient: ContainerClient;

  constructor(private configService: ConfigService) {
    const connectionString = this.configService.get<string>(
      'AZURE_STORAGE_CONNECTION_STRING',
    );
    const sasToken = this.configService.get<string>('SAS_TOKEN');
    const blobServiceUrl = this.configService.get<string>('BLOB_SERVICE_URL');
    const containerName =
      this.configService.get<string>('CONTAINER_NAME') || 'default';

    if (connectionString) {
      this.blobServiceClient =
        BlobServiceClient.fromConnectionString(connectionString);
    } else if (blobServiceUrl && sasToken) {
      // Some environments use URL + SAS token
      const urlWithSas = blobServiceUrl.includes('?')
        ? blobServiceUrl
        : `${blobServiceUrl}?${sasToken}`;
      this.blobServiceClient = new BlobServiceClient(urlWithSas);
    } else if (blobServiceUrl) {
      this.blobServiceClient = new BlobServiceClient(blobServiceUrl);
    } else {
      this.logger.warn(
        'Azure Storage configuration is missing. Uploads will fail.',
      );
    }

    if (this.blobServiceClient) {
      this.containerClient =
        this.blobServiceClient.getContainerClient(containerName);
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    folder: string = 'evidence',
  ): Promise<string> {
    try {
      if (!this.containerClient) {
        throw new Error('Azure Storage Container Client is not initialized');
      }

      // Create a unique filename
      const extension = path.extname(file.originalname);
      const fileName = `${folder}/${uuidv4()}${extension}`;
      const blockBlobClient = this.containerClient.getBlockBlobClient(fileName);

      this.logger.log(`Uploading file to Azure: ${fileName}`);

      await blockBlobClient.uploadData(file.buffer, {
        blobHTTPHeaders: {
          blobContentType: file.mimetype,
        },
      });

      // Return the URL without the SAS token (if present in the client URL)
      // Or the full URL if that's what's needed.
      // Usually we store the path or a clean URL.
      const url = blockBlobClient.url.split('?')[0];
      return url;
    } catch (error) {
      this.logger.error(
        `Error uploading file to Azure: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async deleteFile(fileUrl: string): Promise<void> {
    try {
      if (!this.containerClient) return;

      // Extract path from URL
      const url = new URL(fileUrl);
      const blobName = decodeURIComponent(
        url.pathname.substring(url.pathname.indexOf('/', 1) + 1),
      );

      const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);
      await blockBlobClient.deleteIfExists();
    } catch (error) {
      this.logger.error(`Error deleting file from Azure: ${error.message}`);
    }
  }

  /**
   * Appends the SAS token to a direct blob URL if it doesn't already have one.
   */
  getAuthenticatedUrl(fileUrl: string): string {
    if (!fileUrl) return fileUrl;

    const sasToken = this.configService.get<string>('SAS_TOKEN');
    if (!sasToken || fileUrl.includes('?')) return fileUrl;

    // Ensure SAS token starts with ? if it doesn't
    const token =
      sasToken.startsWith('?') || sasToken.startsWith('&')
        ? sasToken
        : `?${sasToken}`;
    return `${fileUrl}${token}`;
  }
}
