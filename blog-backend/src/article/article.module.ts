import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { Tag } from '../tag/entities/tag.entity';
import { Category } from '../category/entities/category.entity'
import { Collect } from 'src/collect/entities/collect.entity';
import { Information } from 'src/information/entities/information.entity';
import { Like } from './entities/likes.entity';
import { Favorite } from './entities/favorites.entity';
import { SearchRecords } from './entities/searchRecords.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Article, Tag, Category, Collect, Information, Like, Favorite, SearchRecords]),AuthModule],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule { }
