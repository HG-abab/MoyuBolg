import { IsNotEmpty, IsString } from 'class-validator';
export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  categoryName: string;
}

export class updateCategoryDto {
  @IsString()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  categoryName: string;
}


export class CategoryResponseDto {
  @IsString()
  id: number;

  @IsString()
  categoryName: string;

  @IsString()
  articleCount: number;

  @IsString()
  createTime: Date;

  @IsString()
  updateTime: Date;
}

