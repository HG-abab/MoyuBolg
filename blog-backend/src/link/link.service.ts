import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Link } from './entities/link.entity';
import { Between, FindOptionsWhere, Like, Repository } from 'typeorm';
import { CreateLinkDto, SearchLinkDto, UpdateLinkDto } from './dto/link.dto';

@Injectable()
export class LinkService {
  constructor(
    @InjectRepository(Link) private readonly linkRepository: Repository<Link>,
  ) { }

  // 获取
  async getLinks(id?: number): Promise<Link[]> {
    if (id) {
      return await this.linkRepository.find({ where: { id } })
    } else {
      return await this.linkRepository.find()
    }
  }

  // 创建
  async createLink(CreateLinkDto: CreateLinkDto): Promise<Link> {
    const { url, email, background, description, name, userName } = CreateLinkDto
    const maxid = await this.linkRepository.findOne({
      where: {},
      order: { id: 'DESC' }
    })
    const newid = maxid ? maxid.id + 1 : 1
    return await this.linkRepository.save({
      id: newid,
      url,
      email,
      background,
      description,
      name,
      userName,
      isCheck: false,
      createTime: new Date()
    })
  }

  // 是否通过
  async checkLink(UpdateLinkDto: UpdateLinkDto): Promise<Link> {
    const { id, isCheck } = UpdateLinkDto
    const link = await this.linkRepository.findOne({ where: { id } })
    if (!link) {
      throw new NotFoundException('该链接不存在');
    }
    link.isCheck = isCheck
    return await this.linkRepository.save(link)
  }

  // 删除
  async deleteLink(id: number): Promise<Link> {
    const link = await this.linkRepository.findOne({ where: { id } })
    if (!link) {
      throw new NotFoundException('该链接不存在');
    }
    return await this.linkRepository.remove(link)
  }

  // 搜索
  async searchLink(SearchLinkDto: SearchLinkDto): Promise<Link[]> {
    const { name, userName, isCheck, startTime, endTime } = SearchLinkDto
    if (!name && !userName && isCheck === undefined && !startTime && !endTime) {
      return await this.linkRepository.find()
    }
    const where: FindOptionsWhere<Link> = {}

    if (name) {
      where.name = Like(`%${name}%`)
    }

    if (userName) {
      where.userName = Like(`%${userName}%`)
    }

    if (isCheck !== undefined) {
      where.isCheck = isCheck
    }

    if (startTime && endTime) {
      where.createTime = Between(new Date(startTime), new Date(endTime))
    }

    return await this.linkRepository.find({ where })
  }

}
