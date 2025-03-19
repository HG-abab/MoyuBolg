import { IsBoolean, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";


// 创建
export class CreateTreeHoleDto {
  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  avatar: string;
}

// 是否通过
export class isCheckTreeHoleDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsBoolean()
  @IsNotEmpty()
  isCheck: boolean;
}

// 搜索
export class SearchTreeHoleDto {
  @IsString()
  @IsOptional()
  userName?: string;

  @IsBoolean()
  @IsOptional()
  isCheck?: boolean;

  @IsOptional()
  @IsDateString()
  startTime?: string;

  @IsOptional()
  @IsDateString()
  endTime?: string;
}