
import { ForbiddenException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Article } from './entities/article.entity';
import { Tag } from '../tag/entities/tag.entity';
import { Collect } from 'src/collect/entities/collect.entity';
import { Category } from '../category/entities/category.entity'
import { InjectRepository } from '@nestjs/typeorm';
import { WebsiteInformation } from 'src/information/entities/information.entity';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { marked } from 'marked'
import { ArticleSearchDto, CategoryWithArticles, CreateArticleDto, IsCollectDto, IsLikeDto, SearchDto, TagWithArticles, UpdateArticleStatusDto, UpdateArticleTopDto, UserInfo } from './dto/article.dto';
import { Like as Likes } from './entities/likes.entity';
import { SearchRecords } from './entities/searchRecords.entity';
import { Favorite } from './entities/favorites.entity';
@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article) private readonly articleRepository: Repository<Article>,
    @InjectRepository(Tag) private readonly tagRepository: Repository<Tag>,
    @InjectRepository(Category) private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Collect) private readonly collectRepository: Repository<Collect>,
    @InjectRepository(WebsiteInformation) private readonly informationRepository: Repository<WebsiteInformation>,
    @InjectRepository(Likes) private readonly likeRepository: Repository<Likes>,
    @InjectRepository(Favorite) private readonly favoriteRepository: Repository<Favorite>,
    @InjectRepository(SearchRecords) private readonly searchRepository: Repository<SearchRecords>,
  ) { }

  async findAll(id?: number): Promise<Article[]> {
    if (id) {
      // 先查询文章
      const article = await this.articleRepository.findOne({ where: { id } });
      if (article) {
        // 访问量 +1
        await this.articleRepository.update(id, { visitCount: (article.visitCount || 0) + 1 });

        const infolist = await this.informationRepository.findOne({
          where: { id: 1 },
        });
        if (infolist) await this.informationRepository.update(1, { visitCount: (infolist.visitCount || 0) + 1 });
      }
      return article ? [article] : [];
    }
    return this.articleRepository.find(); // 返回所有文章
  }

  // 根据分类名返回文章列表
  async findArticleByCategoryName(): Promise<CategoryWithArticles[]> {
    const categorylist = await this.categoryRepository.find();
    const result: CategoryWithArticles[] = [];
    // 遍历所有分类，获取每个分类下的文章
    for (const category of categorylist) {
      const articles = await this.articleRepository.find({
        where: {
          categoryName: category.categoryName,
        },
      });
      result.push({
        id: category.id,
        categoryName: category.categoryName,
        articles: articles,
      });
    }
    return result;
  }

  // 根据标签名返回文章列表
  async findArticleByTagName(): Promise<TagWithArticles[]> {
    const taglist = await this.tagRepository.find();
    const result: TagWithArticles[] = [];
    // 遍历所有标签，获取每个标签下的文章
    for (const tag of taglist) {
      const articles = await this.articleRepository.find({
        where: {
          tagsName: Like(`%${tag.tagName}%`),
        },
      });

      result.push({
        id: tag.id,
        tagName: tag.tagName,
        articles: articles,
      });
    }
    return result;
  }

  // 添加||更改文章
  async addArticle(createArticleDto: CreateArticleDto, req: UserInfo): Promise<Article> {
    const {
      id,
      articleCover,
      articleTitle,
      articleType,
      categoryName,
      tagsName,
      status,
      isTop,
      userName,
      articleContent,  // 获取文章内容
    } = createArticleDto;

    // 如果传入了 id，则尝试更新现有文章
    if (id) {
      const article = await this.articleRepository.findOne({ where: { id } });
      if (!article) {
        throw new NotFoundException('文章未找到');
      }

      if (article.userName !== req.name && !req.isChecked) {
        throw new ForbiddenException('无权限操作');
      }

      // 保存原始的分类和标签
      const originalCategoryName = article.categoryName;
      const originalTagsName = article.tagsName;

      // 更新文章数据
      article.articleCover = articleCover;
      article.articleTitle = articleTitle;
      article.articleType = articleType;
      article.categoryName = categoryName;
      article.tagsName = tagsName;
      article.status = status;
      article.isTop = isTop;
      article.userName = userName;
      article.articleContent = articleContent;

      // 如果分类变化，更新分类的 articleCount
      if (originalCategoryName !== categoryName) {
        const category = await this.categoryRepository.findOne({ where: { categoryName: originalCategoryName } });
        if (category) {
          category.articleCount -= 1;  // 原分类减去 1
          await this.categoryRepository.save(category);
        }

        const newCategory = await this.categoryRepository.findOne({ where: { categoryName: categoryName } });
        if (newCategory) {
          newCategory.articleCount += 1;  // 新分类加 1
          await this.categoryRepository.save(newCategory);
        }
      }

      // 如果标签变化，更新标签的 articleCount
      for (const tagName of tagsName) {
        if (!originalTagsName.includes(tagName)) {  // 如果标签新加入
          const tag = await this.tagRepository.findOne({ where: { tagName } });
          if (tag) {
            tag.articleCount += 1;
            await this.tagRepository.save(tag);
          }
        }
      }

      // 如果删除了标签，更新标签的 articleCount
      for (const tagName of originalTagsName) {
        if (!tagsName.includes(tagName)) {  // 如果标签被移除
          const tag = await this.tagRepository.findOne({ where: { tagName } });
          if (tag) {
            tag.articleCount -= 1;
            await this.tagRepository.save(tag);
          }
        }
      }

      // 同步更新所有收藏了该文章的记录
      await this.collectRepository.update(
        { type: 1, targetId: id },  // 根据文章 ID 查找所有收藏
        { content: article.articleContent }  // 更新收藏的内容
      );

      //articleContent 处理为有多少个字符
      const markdownContent: string = article.articleContent;  // 你的 Markdown 内容
      const htmlContent: string = await marked(markdownContent);;  // 转换为 HTML
      const contentsize: number = htmlContent.length;  // 获取纯文本字符数
      await this.informationRepository.update(1, { wordCount: contentsize });

      // 保存更新后的文章
      return await this.articleRepository.save(article);
    } else {
      // 获取数据库中最大的 id
      const maxId = await this.articleRepository.findOne({
        where: {},
        order: { id: 'DESC' },
      });
      const newId = maxId ? maxId.id + 1 : 1;

      const article = this.articleRepository.create({
        id: newId,
        articleCover,
        articleTitle,
        articleType,
        categoryName,
        tagsName,
        status,
        isTop,
        userName,
        articleContent,  // 存储文章内容
      });

      // 更新分类表中的 articleCount
      const category = await this.categoryRepository.findOne({ where: { categoryName: categoryName } });
      if (category) {
        category.articleCount += 1;
        await this.categoryRepository.save(category);
      }

      // 更新标签表中的 articleCount
      for (const tagName of tagsName) {
        const tag = await this.tagRepository.findOne({ where: { tagName: tagName } });
        if (tag) {
          tag.articleCount += 1;
          await this.tagRepository.save(tag);
        }
      }
      // 文章数量
      const info = await this.informationRepository.findOne({
        where: { id: 1 },
      });
      if (info) {
        await this.informationRepository.update(1, { articleCount: info.articleCount + 1 });
      }
      //articleContent 处理为有多少个字符
      const markdownContent: string = article.articleContent;  // 你的 Markdown 内容
      const htmlContent: string = await marked(markdownContent);;  // 转换为 HTML
      const contentsize: number = htmlContent.length;  // 获取纯文本字符数

      await this.informationRepository.update(1, { wordCount: contentsize });

      // 保存新创建的文章
      return await this.articleRepository.save(article);
    }
  }

  // 根据 id 删除文章
  async deleteArticle(id: number, req: UserInfo): Promise<Article> {
    const article = await this.articleRepository.findOne({ where: { id } });
    if (!article) {
      throw new NotFoundException('文章未找到');
    }

    if (article.userName !== req.name && !req.isChecked) {
      throw new ForbiddenException('无权限操作');
    }

    // 获取文章的分类名称和标签名称
    const { categoryName, tagsName } = article;

    // 更新分类表中的 articleCount
    const category = await this.categoryRepository.findOne({ where: { categoryName } });
    if (category) {
      category.articleCount -= 1;
      if (category.articleCount < 0) {
        category.articleCount = 0;
      }
      await this.categoryRepository.save(category);
    }

    // 更新标签表中的 articleCount
    for (const tagName of tagsName) {
      const tag = await this.tagRepository.findOne({ where: { tagName } });
      if (tag) {
        tag.articleCount -= 1;
        if (tag.articleCount < 0) {
          tag.articleCount = 0;
        }
        await this.tagRepository.save(tag);
      }
    }
    // 从 WebsiteInformation表中扣除相应的
    const information = await this.informationRepository.findOne({ where: { id: 1 } });
    if (information) {
      information.visitCount -= article.visitCount;
      if (information.visitCount < 0) {
        information.visitCount = 0;
      }
      information.articleCount -= 1;
      if (information.articleCount < 0) {
        information.articleCount = 0;
      }

      const markdownContent: string = article.articleContent;  // 你的 Markdown 内容
      const htmlContent: string = await marked(markdownContent);;  // 转换为 HTML
      const contentsize: number = htmlContent.length;  // 获取纯文本字符数

      information.wordCount -= contentsize
      if (information.wordCount < 0) {
        information.wordCount = 0;
      }

      await this.informationRepository.save(information);
    }

    // 同步更新所有收藏了该文章的记录
    await this.collectRepository.update(
      { type: 1, targetId: id },  // 根据文章 ID 查找所有收藏
      { content: '' }  // 更新收藏的内容
    );

    // 删除点赞表和更新表的内容
    const likeList = await this.likeRepository.find({ where: { articleId: id } });
    if (likeList) {
      await this.likeRepository.delete({ articleId: id });
    }
    const favoriteList = await this.favoriteRepository.find({ where: { articleId: id } });
    if (favoriteList) {
      await this.favoriteRepository.delete({ articleId: id });
    }

    // 删除文章
    return await this.articleRepository.remove(article);
  }

  // 更新文章状态
  async updateArticleStatus(UpdateArticleStatusDto: UpdateArticleStatusDto, req: UserInfo): Promise<Article> {
    const { id, status } = UpdateArticleStatusDto;
    const article = await this.articleRepository.findOne({ where: { id } });
    if (!article) {
      throw new NotFoundException('文章未找到');
    }
    if (article.userName !== req.name && !req.isChecked) {
      throw new ForbiddenException('无权限操作');
    }
    article.status = status;
    return await this.articleRepository.save(article);
  }

  // 更新文章置顶状态
  async updateArticleIsTop(UpdateArticleTopDto: UpdateArticleTopDto, req: UserInfo): Promise<Article> {
    const { id, isTop } = UpdateArticleTopDto;
    const article = await this.articleRepository.findOne({ where: { id } });
    if (!article) {
      throw new NotFoundException('文章未找到');
    }

    if (article.userName !== req.name && !req.isChecked) {
      throw new ForbiddenException('无权限操作');
    }
    article.isTop = isTop;
    return await this.articleRepository.save(article);
  }

  // 根据条件查询文章
  async searchArticles(ArticleSearchDto: ArticleSearchDto): Promise<Article[]> {
    const { articleTitle, categoryName, status, isTop } = ArticleSearchDto;

    // 如果没有任何过滤条件，直接返回所有文章
    if (!articleTitle && !categoryName && !status && isTop === undefined) {
      return this.articleRepository.find();
    }
    console.log(categoryName);

    // 使用 FindOptionsWhere<Article> 类型定义查询条件对象
    const query: FindOptionsWhere<Article> = {};

    // 文章标题模糊查询
    if (articleTitle) {
      query.articleTitle = Like(`%${articleTitle}%`);  // 使用 LIKE 实现模糊查询
    }

    // 分类过滤
    console.log(categoryName);
    if (categoryName) {
      query.categoryName = categoryName;  // 精确匹配分类ID
    }

    // 状态过滤
    if (status !== undefined) {
      query.status = status;  // 精确匹配文章状态
    }

    // 是否顶置过滤
    if (isTop !== undefined) {
      query.isTop = isTop;  // 是否顶置，
    }

    // 查询数据库
    return await this.articleRepository.find({ where: query });
  }

  // 查询置顶文章
  async getTopArticles(): Promise<Article[]> {
    return await this.articleRepository.find({ where: { isTop: 1 } })
  }

  // 通过id 查询上一个文章的tile 和 下一个的title
  async getArticleTitleById(id: number): Promise<{ prevTitle: string, nextTitle: string }> {
    const maxid = await this.articleRepository.findOne({
      where: {},
      order: { id: 'DESC' },
    })

    let newId: number;
    if (!maxid) newId = 1;
    else newId = maxid.id;

    // 最小的情况
    if (id === 1 && newId != 1 && id + 1 <= newId) {
      const nextArticle = await this.articleRepository.findOneBy({ id: id + 1 });
      return {
        prevTitle: '',
        nextTitle: nextArticle ? nextArticle.articleTitle : ''
      };
    }

    // 最大情况
    if (id === newId && id - 1 >= 1) {
      const prevArticle = await this.articleRepository.findOneBy({ id: id - 1 });
      return {
        prevTitle: prevArticle ? prevArticle.articleTitle : '',
        nextTitle: ''
      };
    }

    // 正常情况
    const prevArticle = await this.articleRepository.findOneBy({ id: id - 1 });
    const nextArticle = await this.articleRepository.findOneBy({ id: id + 1 });

    return {
      prevTitle: prevArticle ? prevArticle.articleTitle : '',
      nextTitle: nextArticle ? nextArticle.articleTitle : ''
    };
  }

  // 是否点赞
  async isLike(IsLikeDto: IsLikeDto): Promise<void> {
    const { userName, articleId } = IsLikeDto
    const article = await this.articleRepository.findOne({
      where: { id: articleId }
    });
    if (!article) {
      throw new NotFoundException('文章不存在');
    }

    // 查询该用户是否已点赞
    const like = await this.likeRepository.findOne({
      where: { userName, articleId },
    });

    if (like) {
      // 如果已点赞，取消点赞
      await this.likeRepository.remove(like);
      article.likesCount--;  // 更新点赞数
    } else {
      // 如果未点赞，新增点赞记录
      const newLike = this.likeRepository.create({ userName, articleId });
      await this.likeRepository.save(newLike);
      article.likesCount++;  // 更新点赞数
    }
    await this.articleRepository.save(article);  // 更新文章
  }

  // 查询是否点赞
  async isLiked(IsLikeDto: IsLikeDto): Promise<boolean> {
    const { userName, articleId } = IsLikeDto
    const like = await this.likeRepository.findOne({
      where: { userName, articleId },
    });
    return !!like;
  }

  // 是否收藏
  async isCollect(IsCollectDto: IsCollectDto): Promise<void> {
    const { userName, articleId } = IsCollectDto
    console.log(userName, articleId)
    const article = await this.articleRepository.findOne({
      where: { id: articleId }
    });

    if (!article) {
      throw new NotFoundException('文章不存在');
    }

    // 查询该用户是否已收藏
    const favorite = await this.favoriteRepository.findOne({
      where: { userName, articleId },
    });

    if (favorite) {
      // 如果已收藏，取消收藏
      await this.favoriteRepository.remove(favorite);
      article.favoritesCount--;  // 更新收藏数
    } else {
      // 如果未收藏，新增收藏记录
      const newCollect = this.favoriteRepository.create({ userName, articleId });
      await this.favoriteRepository.save(newCollect);
      article.favoritesCount++;  // 更新收藏数
    }
    await this.articleRepository.save(article);
  }

  // 查询是否收藏
  async isFavorite(IsFavoriteDto: IsCollectDto): Promise<boolean> {
    const { userName, articleId } = IsFavoriteDto
    const favorite = await this.favoriteRepository.findOne({
      where: { userName, articleId },
    });
    return !!favorite;
  }

  // 搜索 标题搜索和按内容搜索
  async search(searchDto: SearchDto): Promise<Article[]> {
    const { userName, Content, type } = searchDto;

    // 1. 检查是否存在相同的搜索记录
    const existingRecord = await this.searchRepository.findOne({
      where: { userName, content: Content },
    });

    // 2. 如果存在相同记录，删除该记录
    if (existingRecord) {
      await this.searchRepository.remove(existingRecord);
    }

    // 3. 检查 id=1 是否已经被占用
    const existingId1Record = await this.searchRepository.findOne({
      where: { id: 1 },
    });

    // 4. 如果 id=1 已经被占用，将所有记录的 id 加 1，腾出 id=1 的位置
    if (existingId1Record) {
      // 获取所有记录的 id，按 id 升序排序
      const allRecords = await this.searchRepository.find({
        order: { id: 'ASC' },
      });

      // 从后往前更新 id，避免主键冲突
      for (let i = allRecords.length - 1; i >= 0; i--) {
        const record = allRecords[i];
        record.id = record.id + 1; // 将 id 加 1
        await this.searchRepository.save(record);
      }
    }

    // 5. 插入新的记录到 id=1
    const searchRecord = this.searchRepository.create({
      id: 1,
      userName,
      content: Content,
    });

    await this.searchRepository.save(searchRecord);

    let articlesTitle: Article[] = [];

    // 6. 根据 type 进行标题或内容的搜索
    if (type === 1) {
      articlesTitle = await this.articleRepository.find({
        where: { articleTitle: Like(`%${Content}%`) },
      });
    } else {
      articlesTitle = await this.articleRepository.find({
        where: { articleContent: Like(`%${Content}%`) },
      });
    }

    // 7. 如果没有找到相关的文章，返回空数组
    if (articlesTitle.length === 0) {
      return [];
    }

    return articlesTitle;
  }


  // 获取搜索记录
  async getSearchRecords(userName: string): Promise<SearchRecords[]> {
    if (!userName) {
      throw new HttpException('用户名不能为空', HttpStatus.BAD_REQUEST);
    }
    return await this.searchRepository.find({ where: { userName: userName } });
  }


  // 删除搜索记录 
  async deleteSearchRecord(userName: string): Promise<SearchRecords[]> {
    if (!userName) {
      throw new HttpException('用户名不能为空', HttpStatus.BAD_REQUEST);
    }
    const searchRecord = await this.searchRepository.find({ where: { userName } });
    if (!searchRecord) {
      throw new HttpException('搜索记录不存在', HttpStatus.BAD_REQUEST);
    }
    return await this.searchRepository.remove(searchRecord);
  }
}
