import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Favorite } from './entities/favorites.entity'
import { Like } from './entities/likes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message, Favorite, Like])],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule { }
