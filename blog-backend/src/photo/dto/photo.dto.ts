import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

// 查询分页数据
export class PhotoQueryDto {
  @IsNotEmpty()
  @IsNumber()
  pageNum: number;

  @IsNotEmpty()
  @IsNumber()
  pageSize: number;

  @IsNumber()
  @IsOptional()
  parentId?: number | null;
}

export class CreatePhotoDto {
  @IsNotEmpty()
  @IsString()
  name: string;  // 照片/相册名称

  @IsOptional()
  @IsString()
  description: string;  // 描述（可选）

  @IsOptional()
  @IsNumber()
  parentId: number | null;  // 父相册ID，可为空

  @IsNotEmpty()
  @IsNumber()
  type: number;  // 1: 相册, 2: 照片

  @IsOptional()
  @IsString()
  url: string;  // URL（可选）

  @IsOptional()
  @IsString()
  size: string;  // 大小（可选）
}

export class UpdateAlbumDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}

export class DeletePhotoOrAlbumDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsNumber()
  @IsNotEmpty()
  type: number

  @IsOptional()
  @IsNumber()
  parentId: number | null; 
}