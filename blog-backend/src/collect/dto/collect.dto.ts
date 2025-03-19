import { IsBoolean, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateCollectDto {
  @IsNumber()
  @IsNotEmpty()
  type: number; // 收藏的类型，1: 文章，2: 留言

  @IsNumber()
  @IsNotEmpty()
  targetId: number; // 被收藏的文章或留言 ID

  @IsString()
  @IsNotEmpty()
  userName: string;
}

// 是否通过
export class IsisCheckDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsBoolean()
  @IsNotEmpty()
  isCheck: boolean;
}

// 搜索
export class SearchCollectDto {
  @IsOptional()
  @IsString()
  userName?: string;

  @IsOptional()
  @IsNumber()
  type?: number;

  @IsOptional()
  @IsBoolean()
  isCheck?: boolean;

  @IsOptional()
  @IsDateString()
  startTime?: string;

  @IsOptional()
  @IsDateString()
  endTime?: string;
}