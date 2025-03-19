import { IsNotEmpty, IsString, IsOptional, IsInt, IsDate, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class InformationDto {
  @IsOptional()
  @IsString()
  webmasterName?: string;

  @IsOptional()
  @IsString()
  webmasterCopy?: string;

  @IsOptional()
  @IsString()
  webmasterAvatar?: string;

  @IsOptional()
  @IsString()
  webmasterProfileBackground?: string;

  @IsOptional()
  @IsString()
  githubLink?: string;

  @IsOptional()
  @IsString()
  giteeLink?: string;

  @IsOptional()
  @IsString()
  websiteName?: string;

  @IsOptional()
  @IsString()
  headerNotification?: string;

  @IsOptional()
  @IsString()
  sidebarAnnouncement?: string;

  @IsOptional()
  @IsString()
  recordInfo?: string;

  @IsOptional()
  @Transform(({ value }) => new Date(value))  // 确保转换为 Date
  @IsDate()
  startTime?: Date;

  @IsOptional()
  @Transform(({ value }) => new Date(value))  // 确保转换为 Date
  @IsDate()
  lastUpdateTime?: Date;

  @IsOptional()
  @IsInt()
  articleCount?: number;

  @IsOptional()
  @IsInt()
  wordCount?: number;

  @IsOptional()
  @IsInt()
  visitCount?: number;

  @IsOptional()
  @IsString()
  runTime?: string;
}


export class CreateBgUrlDto {
  @IsString()
  @IsNotEmpty()
  url: string; // 背景图url

  @IsInt()
  @Min(0)
  size: number; // 文件大小

  @IsString()
  @IsNotEmpty()
  type: string; // 文件类型

  @IsString()
  @IsNotEmpty()
  userId: string; // 用户ID

  @IsInt()
  @Min(0)
  sortOrder: number; // 排序顺序
}