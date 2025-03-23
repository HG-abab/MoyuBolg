import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { InformationModule } from './information/information.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UploadModule } from './upload/upload.module';
import { ArticleModule } from './article/article.module';
import { TagModule } from './tag/tag.module';
import { CategoryModule } from './category/category.module';
import { MessageModule } from './message/message.module';
import { CollectModule } from './collect/collect.module';
import { CommentModule } from './comment/comment.module';
import { TreeHoleModule } from './tree-hole/tree-hole.module';
import { LinkModule } from './link/link.module';
import { PhotoModule } from './photo/photo.module';
import { AiModule } from './ai/ai.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MailModule } from './mail/mail.module';
import jwtConfig from '../jwt.config';  // 引入 jwt 配置

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,  // 设置为全局模块
      envFilePath: '.env',  // 指定环境文件路径
      load: [jwtConfig], // 加载jwt配置
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public/uploaded'),
      serveRoot: '/static',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'blog-backend',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      charset: 'utf8mb4_general_ci',
      synchronize: true, // 生产环境建议设为 false
    }),
    InformationModule,
    UploadModule,
    ArticleModule,
    TagModule,
    CategoryModule,
    MessageModule,
    CollectModule,
    CommentModule,
    TreeHoleModule,
    LinkModule,
    PhotoModule,
    AiModule,
    AuthModule,
    UsersModule,
    MailModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
