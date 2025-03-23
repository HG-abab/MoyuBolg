import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Favorite } from './entities/favorites.entity'
import { Like } from './entities/likes.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Message, Favorite, Like]), AuthModule],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule { }
