import { Module } from '@nestjs/common';
import { CollectService } from './collect.service';
import { CollectController } from './collect.controller';
import { Collect } from './entities/collect.entity';
import { Article } from 'src/article/entities/article.entity';
import { Message } from 'src/message/entities/message.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Collect, Article, Message]),AuthModule],
  controllers: [CollectController],
  providers: [CollectService],
})
export class CollectModule { }
