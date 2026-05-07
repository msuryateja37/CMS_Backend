"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var StorageService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const storage_blob_1 = require("@azure/storage-blob");
const uuid_1 = require("uuid");
const path = __importStar(require("path"));
let StorageService = StorageService_1 = class StorageService {
    configService;
    logger = new common_1.Logger(StorageService_1.name);
    blobServiceClient;
    containerClient;
    constructor(configService) {
        this.configService = configService;
        const connectionString = this.configService.get('AZURE_STORAGE_CONNECTION_STRING');
        const sasToken = this.configService.get('SAS_TOKEN');
        const blobServiceUrl = this.configService.get('BLOB_SERVICE_URL');
        const containerName = this.configService.get('CONTAINER_NAME') || 'default';
        if (connectionString) {
            this.blobServiceClient =
                storage_blob_1.BlobServiceClient.fromConnectionString(connectionString);
        }
        else if (blobServiceUrl && sasToken) {
            const urlWithSas = blobServiceUrl.includes('?')
                ? blobServiceUrl
                : `${blobServiceUrl}?${sasToken}`;
            this.blobServiceClient = new storage_blob_1.BlobServiceClient(urlWithSas);
        }
        else if (blobServiceUrl) {
            this.blobServiceClient = new storage_blob_1.BlobServiceClient(blobServiceUrl);
        }
        else {
            this.logger.warn('Azure Storage configuration is missing. Uploads will fail.');
        }
        if (this.blobServiceClient) {
            this.containerClient =
                this.blobServiceClient.getContainerClient(containerName);
        }
    }
    async uploadFile(file, folder = 'evidence') {
        try {
            if (!this.containerClient) {
                throw new Error('Azure Storage Container Client is not initialized');
            }
            const extension = path.extname(file.originalname);
            const fileName = `${folder}/${(0, uuid_1.v4)()}${extension}`;
            const blockBlobClient = this.containerClient.getBlockBlobClient(fileName);
            this.logger.log(`Uploading file to Azure: ${fileName}`);
            await blockBlobClient.uploadData(file.buffer, {
                blobHTTPHeaders: {
                    blobContentType: file.mimetype,
                },
            });
            const url = blockBlobClient.url.split('?')[0];
            return url;
        }
        catch (error) {
            this.logger.error(`Error uploading file to Azure: ${error.message}`, error.stack);
            throw error;
        }
    }
    async deleteFile(fileUrl) {
        try {
            if (!this.containerClient)
                return;
            const url = new URL(fileUrl);
            const blobName = decodeURIComponent(url.pathname.substring(url.pathname.indexOf('/', 1) + 1));
            const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);
            await blockBlobClient.deleteIfExists();
        }
        catch (error) {
            this.logger.error(`Error deleting file from Azure: ${error.message}`);
        }
    }
    getAuthenticatedUrl(fileUrl) {
        if (!fileUrl)
            return fileUrl;
        const sasToken = this.configService.get('SAS_TOKEN');
        if (!sasToken || fileUrl.includes('?'))
            return fileUrl;
        const token = sasToken.startsWith('?') || sasToken.startsWith('&')
            ? sasToken
            : `?${sasToken}`;
        return `${fileUrl}${token}`;
    }
};
exports.StorageService = StorageService;
exports.StorageService = StorageService = StorageService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], StorageService);
//# sourceMappingURL=storage.service.js.map