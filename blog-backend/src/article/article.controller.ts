import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { ArticleService } from './article.service';
import { Article } from './entities/article.entity';
import { ArticleSearchDto, CategoryWithArticles, CreateArticleDto, IsCollectDto, IsLikeDto, SearchDto, TagWithArticles, UpdateArticleStatusDto, UpdateArticleTopDto } from './dto/article.dto';
import { SearchRecords } from './entities/searchRecords.entity';
import { AuthGuard } from 'src/auth/auth.guard';


@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) { }

  // 获取全部文章
  // 有id 获取指定文章
  @Get()
  async getArticles(): Promise<Article[]> {
    return this.articleService.findAll();
  }

  // 根据分类名 返回文章列表
  @Get('/category')
  async findArticleByCategoryName(): Promise<CategoryWithArticles[]> {
    return this.articleService.findArticleByCategoryName();
  }

  // 根据标签名返回文章列表
  @Get('/tag')
  async findArticleByTagName(): Promise<TagWithArticles[]> {
    return this.articleService.findArticleByTagName();
  }

  // 查询置顶文章
  @Get('/getTopArticle')
  async getTopArticle(): Promise<Article[]> {
    return this.articleService.getTopArticles();
  }

  //通过id 查询上一个文章的tile 和 下一个的title
  @Get('/articleTitle/:id')
  async getArticleTitle(@Param('id') id: number): Promise<{ prevTitle: string, nextTitle: string }> {
    return this.articleService.getArticleTitleById(id)
  }


  @Get(':id')
  async getArticle(@Param('id') id: number): Promise<Article[]> {
    return this.articleService.findAll(id);
  }

  @Post('/addActicle')
  @UseGuards(AuthGuard)
  async addArticle(@Body() CreateArticleDto: CreateArticleDto, @Request() req): Promise<Article> {
    return this.articleService.addArticle(CreateArticleDto, req.user)
  }


  // 删除指定文章
  @Delete('/deleteArticle')
  @UseGuards(AuthGuard)
  async deleteArticle(@Param('id') id: number, @Request() req): Promise<Article> {
    return this.articleService.deleteArticle(id, req.user)
  }

  // 获取搜索记录
  @Post('/search')
  async getSearchRecords(@Body() body: { userName: string }): Promise<SearchRecords[]> {
    const { userName } = body;
    return this.articleService.getSearchRecords(userName);

  }

  // 删除搜索记录
  @Delete('/deleteSearchRecord')
  async deleteSearchRecord(@Body() body: { userName: string }): Promise<SearchRecords[]> {
    const { userName } = body;
    return this.articleService.deleteSearchRecord(userName)
  }

  // 更新文章状态
  @Put('/updateArticle')
  @UseGuards(AuthGuard)
  async updateArticle(@Body() UpdateArticleStatusDto: UpdateArticleStatusDto, @Request() req): Promise<Article> {
    return this.articleService.updateArticleStatus(UpdateArticleStatusDto, req.user)
  }

  // 更新置顶状态
  @Put('/updateArticleTop')
  @UseGuards(AuthGuard)
  async updateArticleTop(@Body() UpdateArticleTopDto: UpdateArticleTopDto, @Request() req): Promise<Article> {
    return this.articleService.updateArticleIsTop(UpdateArticleTopDto, req.user)
  }

  // 搜索
  @Post('/search')
  async search(@Body() articleSearchDto: ArticleSearchDto): Promise<Article[]> {
    return this.articleService.searchArticles(articleSearchDto);
  }

  // 搜索 标题搜索和按内容搜索
  @Post('/searchTitle')
  async searchTitle(@Body() SearchDto: SearchDto): Promise<Article[]> {
    return this.articleService.search(SearchDto);
  }

  // 点赞
  @Put('/likeArticle')
  async isLike(@Body() IsLikeDto: IsLikeDto): Promise<void> {
    return this.articleService.isLike(IsLikeDto)
  }

  // 查询是否点赞
  @Post('/isLikeArticle')
  async isLiked(@Body() IsLikeDto: IsLikeDto): Promise<boolean> {
    return this.articleService.isLiked(IsLikeDto)
  }

  // 收藏
  @Put('/collectArticle')
  async isCollect(@Body() IsCollectDto: IsCollectDto): Promise<void> {
    return this.articleService.isCollect(IsCollectDto)
  }
  // 查询是否收藏
  @Post('/isCollectArticle')
  async isFavorite(@Body() IsCollectDto: IsCollectDto): Promise<boolean> {
    return this.articleService.isFavorite(IsCollectDto)
  }


}
