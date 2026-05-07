import { ConfigService } from '@nestjs/config';
export declare class StorageService {
    private configService;
    private readonly logger;
    private blobServiceClient;
    private containerClient;
    constructor(configService: ConfigService);
    uploadFile(file: Express.Multer.File, folder?: string): Promise<string>;
    deleteFile(fileUrl: string): Promise<void>;
    getAuthenticatedUrl(fileUrl: string): string;
}
