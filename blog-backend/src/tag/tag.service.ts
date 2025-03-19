import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsWhere, Like, Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';
import { createTagDto, TagResponseDto, updateTagDto } from './dto/tag.dto';
import * as dayjs from 'dayjs';


@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag) private readonly tagRepository: Repository<Tag>,
  ) { }

  async findAll(): Promise<Tag[]> {
    return await this.tagRepository.find();
  }

  async create(createTagDto: createTagDto): Promise<Tag> {
    // 确保添加的不是重复的
    const tag = await this.tagRepository.findOne({ where: { tagName: createTagDto.tagName } });
    if (tag) {
      return tag;
    }
    // 获取最大 ID 的记录
    const maxId = await this.tagRepository.findOne({
      where: {},
      order: { id: 'DESC' }, // 按照 ID 降序排列
    });

    // 确定新的 ID
    const newId = maxId  ? maxId .id + 1 : 1;

    const createTag = {
      ...createTagDto,
      id: newId,
      createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    };

    return await this.tagRepository.save(createTag);
  }
  async delete(id: number): Promise<TagResponseDto> {
    // 查找要删除的标签
    const tagToDelete = await this.tagRepository.findOne({
      where: { id: id },
    });

    if (!tagToDelete) {
      throw new NotFoundException(`Tag with id ${id} not found`);
    }

    await this.tagRepository.delete(id);

    return tagToDelete;
  }

  // 更新标签
  async update(updateTagDto: updateTagDto): Promise<TagResponseDto> {
    const { id, tagName } = updateTagDto;
    // 查询 tag 是否存在
    const tag = await this.tagRepository.findOne({ where: { id } });

    if (!tag) {
      throw new Error('Tag not found');
    }

    // 只更新 tagName 和 updateTime
    await this.tagRepository.update(id, {
      tagName,
      updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
    });

    const updatedTag = await this.tagRepository.findOne({ where: { id } });

    if (!updatedTag) {
      throw new Error('Failed to update tag');
    }

    return updatedTag;
  }
  // 搜索标签
  async searchTags(tagName?: string, startTime?: string, endTime?: string): Promise<Tag[]> {
    if (!tagName && !startTime && !endTime) {
      return this.tagRepository.find();
    }

    const query: FindOptionsWhere<Tag> = {};

    if (tagName) {
      query.tagName = Like(`%${tagName}%`); // 模糊查询
    }

    if (startTime && endTime) {
      query.createTime = Between(new Date(startTime), new Date(endTime));
    }

    return await this.tagRepository.find({ where: query });
  }



}
