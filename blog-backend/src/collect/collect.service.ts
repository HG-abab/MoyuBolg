import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Collect } from './entities/collect.entity';
import { Article } from 'src/article/entities/article.entity';
import { Message } from 'src/message/entities/message.entity';
import { Between, FindOptionsWhere, Like, Repository } from 'typeorm';
import { CreateCollectDto, IsisCheckDto, SearchCollectDto } from './dto/collect.dto';

@Injectable()
export class CollectService {
  constructor(
    @InjectRepository(Collect) private readonly collectRepository: Repository<Collect>,
    @InjectRepository(Article) private readonly articleRepository: Repository<Article>,
    @InjectRepository(Message) private readonly messageRepository: Repository<Message>,
  ) { }

  // 获取收藏表
  async getCollectList(id?: number): Promise<Collect[]> {
    if (id) {
      return await this.collectRepository.find({ where: { id } })
    } else {
      return await this.collectRepository.find()
    }
  }

  // 创建收藏
  async createCollect(createCollectDto: CreateCollectDto): Promise<Collect> {
    const { type, targetId, userName } = createCollectDto;

    let content: string;

    // 根据 type 来判断是文章还是留言
    if (type === 1) {
      const article = await this.articleRepository.findOne({
        where: { id: targetId },
      });
      if (!article) {
        throw new NotFoundException('Article not found');
      }
      content = article.articleContent;
    } else if (type === 2) {
      const message = await this.messageRepository.findOne({
        where: { id: targetId },
      });
      if (!message) {
        throw new NotFoundException('Message not found');
      }
      content = message.content;
    } else {
      throw new NotFoundException('Invalid type');
    }

    const maxid = await this.collectRepository.findOne({
      where: {},
      order: { id: 'DESC' },
    })

    const newId = maxid ? maxid.id + 1 : 1

    const collect = this.collectRepository.create({
      id: newId,
      targetId,
      type,
      content,
      userName,
      createTime: new Date(),
      updateTime: new Date(),
    });

    // 保存收藏
    return await this.collectRepository.save(collect);
  }

  // 是否通过
  async isCheck(IsisCheckDto: IsisCheckDto): Promise<Collect> {
    const { id, isCheck } = IsisCheckDto;
    const collect = await this.collectRepository.findOne({
      where: { id },
    })
    if (!collect) {
      throw new NotFoundException('该收藏不存在');
    }
    collect.isCheck = isCheck;
    collect.updateTime = new Date();
    return await this.collectRepository.save(collect);
  }

  // 删除
  async deleteCollect(id: number): Promise<Collect> {
    const collect = await this.collectRepository.findOne({
      where: { id },
    })
    if (!collect) {
      throw new NotFoundException('该收藏不存在');
    }
    return await this.collectRepository.remove(collect);
  }

  // 搜索
  async searchCollect(searchCollectDto: SearchCollectDto): Promise<Collect[]> {
    const { userName, type, isCheck, startTime, endTime } = searchCollectDto;
    console.log(userName, type, isCheck, startTime, endTime);
    if (!userName && !type && isCheck === undefined && !startTime && !endTime) {
      return await this.collectRepository.find();
    }
    const where: FindOptionsWhere<Collect> = {}
    if (userName) {
      where.userName = Like(`%${userName}%`);
    }
    if (type !== undefined) {
      where.type = type;
    }
    if (isCheck !== undefined) {
      where.isCheck = isCheck;
    }
    if (startTime && endTime) {
      where.createTime = Between(new Date(startTime), new Date(endTime));
    }
    return await this.collectRepository.find({
      where,
    })
  }

}
