import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Article } from 'src/article/entities/article.entity';
import { Message } from 'src/message/entities/message.entity'
import { AuthModule } from 'src/auth/auth.module';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Article, Message, User]), AuthModule],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule { }
