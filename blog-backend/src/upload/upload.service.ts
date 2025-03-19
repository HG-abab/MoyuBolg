// src/upload/upload.service.ts
import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { promises as fsPromises } from 'fs';

interface ImageRecord {
  hash: string;
  filename: string;
  path: string;
  createdAt: Date;
}

@Injectable()
export class UploadService {
  private imageRecords: Map<string, ImageRecord> = new Map();
  private readonly uploadDir = './public/uploaded';

  constructor() {
    // 确保上传目录存在
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
    // 初始化时加载已有记录
    this.loadExistingRecords();
  }

  private loadExistingRecords() {
    const files = fs.readdirSync(this.uploadDir);
    for (const filename of files) {
      const filePath = path.join(this.uploadDir, filename);
      const fileContent = fs.readFileSync(filePath); // 读取文件内容
      const hash = this.calculateHash(fileContent); // 计算文件的哈希值
      // 将哈希值、文件名、路径和创建时间添加到imageRecords中
      this.imageRecords.set(hash, {
        hash,
        filename,
        path: `/static/uploaded/${filename}`,
        createdAt: fs.statSync(filePath).ctime
      });
    }
  }

  private calculateHash(buffer: Buffer): string {
    return createHash('sha256').update(buffer).digest('hex');
  }

  async handleImageUpload(file: Express.Multer.File): Promise<{ filename: string; path: string; isExisting: boolean }> {
    const fileBuffer = await fsPromises.readFile(file.path);
    const hash = this.calculateHash(fileBuffer);

    // 检查是否存在相同的图片
    const existingRecord = this.imageRecords.get(hash);
    if (existingRecord) {
      // 如果是重复图片，删除新上传的文件
      await fsPromises.unlink(file.path);
      return {
        filename: existingRecord.filename,
        path: `http://localhost:3000${existingRecord.path}`,
        isExisting: true
      };
    }

    // 如果是新图片，添加到记录中
    const record: ImageRecord = {
      hash,
      filename: file.filename,
      path: `/static/uploaded/${file.filename}`,
      createdAt: new Date()
    };
    this.imageRecords.set(hash, record);

    return {
      filename: file.filename,
      path: `http://localhost:3000${record.path}`,
      isExisting: false
    };
  }
}