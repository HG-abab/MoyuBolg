import { IsBoolean, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

// 创建留言
export class CreateMessageDto {
  @IsNotEmpty()
  @IsString()
  userName: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsString()
  avatar: string;
}

// 更新审核状态
export class UpdateMessageDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsBoolean()
  isCheck: boolean;
}
//搜索
export class SearchMessageDto {
  @IsOptional()
  @IsString()
  userName?: string;

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

// 是否点赞
export class IsLikeDto {
  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsNumber()
  @IsNotEmpty()
  messageId: number;
}

// 是否收藏
export class IsCollectDto {
  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsNumber()
  @IsNotEmpty()
  messageId: number;
}