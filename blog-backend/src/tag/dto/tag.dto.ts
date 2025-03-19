import { IsNotEmpty, IsString } from 'class-validator';

export class createTagDto {
  @IsString()
  @IsNotEmpty()
  tagName: string;
}

export class updateTagDto {
  @IsString()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  tagName: string;
}

export class TagResponseDto {
  @IsString()
  id: number;

  @IsString()
  tagName: string;

  @IsString()
  articleCount: number;

  @IsString()
  createTime: Date;

  @IsString()
  updateTime: Date;
}

