import { IsString, IsNumber, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateCommentDto {
  @IsNumber()
  @IsNotEmpty()
  type: number;

  @IsNumber()
  @IsNotEmpty()
  typeId: number; // 评论关联的对象 ID，例如，文章 ID 或 留言 ID

  @IsString()
  @IsNotEmpty()
  Avatar: string; 

  @IsString()
  @IsNotEmpty()
  commentContent: string; // 评论内容

  @IsString()
  @IsNotEmpty()
  commentUserName: string; // 评论者的用户名

  @IsString()
  @IsNotEmpty()
  commentTitle: string; // 评论标题

  @IsOptional()
  @IsNumber()
  parentId?: number; // 父评论 ID，如果是子评论就传 parentId
}

// 是否通过
export class IsCommentCheckDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsBoolean()
  @IsNotEmpty()
  isCheck: boolean;
}

// src/comment/dto/search-comment.dto.ts

export class SearchCommentDto {
  @IsOptional()
  @IsString()
  commentUserName?: string;

  @IsOptional()
  @IsString()
  commentContent?: string;

  @IsOptional()
  @IsNumber()
  type?: number;

  @IsOptional()
  @IsBoolean()
  isCheck?: boolean;
}

// 删除评论
export class DeleteCommentDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsOptional()
  @IsNumber()
  type?: number;

  @IsNumber()
  @IsOptional()
  typeId?: number;
}

// 查询文章或者留言的评论
export class SearchCommentByTypeIdDto {
  @IsNumber()
  @IsNotEmpty()
  typeId: number;

  @IsNumber()
  @IsNotEmpty()
  type: number;
}
