import { IsString, IsNotEmpty, IsArray, IsNumber, IsOptional } from 'class-validator';
import { Article } from '../entities/article.entity';

// 创建一个自定义类型，扩展 Express 的 Request 类型，添加 user 属性

export class CategoryWithArticles {
  id: number;
  categoryName: string;
  articles: Article[];
}
export class TagWithArticles {
  id: number;
  tagName: string;
  articles: Article[];
}
export class CreateArticleDto {
  @IsOptional()
  @IsNumber()
  id?: number;  // 文章 ID，当更新文章时可以传入

  @IsString()
  @IsNotEmpty()
  articleCover: string;  // 文章封面

  @IsString()
  @IsNotEmpty()
  articleTitle: string;  // 文章标题

  @IsNumber()
  @IsNotEmpty()
  articleType: number;  // 文章类型

  @IsString()
  @IsNotEmpty()
  articleContent: string;  // 新增字段

  @IsString()
  @IsNotEmpty()
  categoryName: string;  // 分类名称

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  tagsName: string[];  // 标签名称，数组形式

  @IsNumber()
  @IsNotEmpty()
  status: number = 1;  // 状态，默认值为 1

  @IsNumber()
  @IsNotEmpty()
  isTop: number = 0;  // 是否置顶，默认值为 false

  @IsString()
  @IsNotEmpty()
  userName: string;  // 用户名
}

// 更新文章状态
export class UpdateArticleStatusDto {
  // id
  @IsNumber()
  @IsNotEmpty()
  id: number;

  // 状态
  @IsNumber()
  @IsNotEmpty()
  status: number;
}

//更新文章置顶状态
export class UpdateArticleTopDto {
  // id
  @IsNumber()
  @IsNotEmpty()
  id: number;

  // 状态
  @IsNumber()
  @IsNotEmpty()
  isTop: number;
}

// 查询
// dto/article-search.dto.ts
export class ArticleSearchDto {
  @IsString()
  @IsOptional()
  articleTitle?: string;
  @IsString()
  @IsOptional()
  categoryName?: string;
  @IsNumber()
  @IsOptional()
  status?: number;
  @IsNumber()
  @IsOptional()
  isTop?: number;
}

// 是否点赞
export class IsLikeDto {
  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsNumber()
  @IsNotEmpty()
  articleId: number;
}

// 是否收藏
export class IsCollectDto {
  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsNumber()
  @IsNotEmpty()
  articleId: number;
}


// 搜索内容
export class SearchDto {
  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsString()
  @IsNotEmpty()
  Content: string;

  @IsNumber()
  @IsNotEmpty()
  type: number;
}

export interface UserInfo {
  name: string;
  isChecked: boolean;
}