// src/upload/upload.controller.ts
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public/uploaded',
        filename: (_, file, callback) => {
          const fileName = `${new Date().getTime()}${extname(file.originalname)}`;
          callback(null, fileName);
        },
      }),
    }),
  )
  async upload(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File upload failed. Please check the request.');
    }

    const result = await this.uploadService.handleImageUpload(file);
    return {
      filename: result.filename,
      path: result.path,
      isExisting: result.isExisting
    };
  }
}