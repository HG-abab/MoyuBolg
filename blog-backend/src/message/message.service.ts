import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity'
import { Between, FindOptionsWhere, Like, Repository } from 'typeorm';
import { CreateMessageDto, IsCollectDto, IsLikeDto, SearchMessageDto, UpdateMessageDto } from './dto/message.dto';
import { Favorite } from './entities/favorites.entity'
import { Like as likes } from './entities/likes.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message) private readonly messageRepository: Repository<Message>,
    @InjectRepository(Favorite) private readonly favoriteRepository: Repository<Favorite>,
    @InjectRepository(likes) private readonly likesRepository: Repository<likes>,
  ) { }

  // 获取留言
  async getMessage(id?: number): Promise<Message[]> {
    if (id) {
      const message = await this.messageRepository.findOne({ where: { id } });  // 传入查询选项
      return message ? [message] : [];
    } else {
      return await this.messageRepository.find();
    }
  }

  // 创建留言
  async createMessage(CreateMessageDto: CreateMessageDto): Promise<Message> {
    const { userName, content, avatar } = CreateMessageDto;

    const maxId = await this.messageRepository.findOne({
      where: {},
      order: { id: 'DESC' },
    });
    const id = maxId ? maxId.id + 1 : 1;
    // 创建一个新的 message 实体
    const message = this.messageRepository.create({
      id,
      userName,
      avatar,
      content,
      isCheck: false, // 默认 false
      createTime: new Date(), // 自动填充创建时间
      updateTime: new Date(),
    });
    // 保存消息到数据库
    return await this.messageRepository.save(message);
  }

  // 更新审核状态
  async updateCheckStatus(UpdateMessageDto: UpdateMessageDto): Promise<Message> {
    const { id, isCheck } = UpdateMessageDto;
    const messageList = await this.messageRepository.findOne({ where: { id } });
    if (!messageList) {
      throw new NotFoundException('留言不存在');
    }
    messageList.isCheck = isCheck;
    messageList.updateTime = new Date();
    return await this.messageRepository.save(messageList);
  }

  // 删除留言
  async deleteMessage(id: number): Promise<Message> {
    const message = await this.messageRepository.findOne({ where: { id } });
    if (!message) {
      throw new NotFoundException('留言不存在');
    }
    return await this.messageRepository.remove(message);
  }

  // 搜索
  async searchMessage(SearchMessageDto: SearchMessageDto): Promise<Message[]> {
    const { userName, isCheck, startTime, endTime } = SearchMessageDto;
    if (!userName && isCheck === undefined && !startTime && !endTime) {
      return await this.messageRepository.find();
    }
    const where: FindOptionsWhere<Message> = {};
    if (userName) {
      where.userName = Like(`%${userName}%`);
    }
    if (isCheck !== undefined) {
      where.isCheck = isCheck;
    }
    if (startTime && endTime) {
      where.createTime = Between(new Date(startTime), new Date(endTime));
    }
    return this.messageRepository.find({ where });
  }

  // 是否点赞
  async isLike(IsLikeDto: IsLikeDto): Promise<void> {
    const { userName, messageId } = IsLikeDto
    const message = await this.messageRepository.findOne({
      where: { id: messageId }
    })
    if (!message) {
      throw new NotFoundException('留言不存在');
    }
    // 查询该用户是否已点赞
    const like = await this.likesRepository.findOne({
      where: { userName, messageId }
    });
    if (like) {
      // 如果已点赞，取消点赞
      await this.likesRepository.remove(like);
      message.likesCount--;
    } else {
      // 如果未点赞，添加点赞
      const newLike = this.likesRepository.create({ userName, messageId });
      await this.likesRepository.save(newLike);
      message.likesCount++;  // 更新点赞数
    }
    await this.messageRepository.save(message);
  }

  // 查询是否点赞
  async isLiked(IsLikeDto: IsLikeDto): Promise<boolean> {
    const { userName, messageId } = IsLikeDto
    const like = await this.likesRepository.findOne({
      where: { userName, messageId },
    });
    return !!like;
  }

  // 是否收藏
  async isCollect(IsCollectDto: IsCollectDto): Promise<void> {
    const { userName, messageId } = IsCollectDto
    const message = await this.messageRepository.findOne({
      where: { id: messageId }
    })
    if (!message) {
      throw new NotFoundException('留言不存在');
    }

    // 查询该用户是否已收藏
    const favorite = await this.favoriteRepository.findOne({
      where: { userName, messageId },
    });
    if (favorite) {
      // 如果已收藏，取消收藏
      await this.favoriteRepository.remove(favorite);
      message.favoritesCount--;  // 更新收藏数
    } else {
      // 如果未收藏，新增收藏记录
      const newCollect = this.favoriteRepository.create({ userName, messageId });
      await this.favoriteRepository.save(newCollect);
      message.favoritesCount++;  // 更新收藏数
    }
    await this.messageRepository.save(message);
  }

  // 查询是否收藏
  async isFavorite(IsFavoriteDto: IsCollectDto): Promise<boolean> {
    const { userName, messageId } = IsFavoriteDto
    const favorite = await this.favoriteRepository.findOne({
      where: { userName, messageId },
    });
    return !!favorite;
  }


}
