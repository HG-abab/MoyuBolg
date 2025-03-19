import { Injectable, NotFoundException } from '@nestjs/common';
import { Category } from './entities/category.entity'
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsWhere, Like, Repository } from 'typeorm';
import { CreateCategoryDto, updateCategoryDto } from './dto/category.dto';
import * as dayjs from 'dayjs';

@Injectable()
export class CategoryService {

  constructor(
    @InjectRepository(Category) private readonly categoryRepository: Repository<Category>,
  ) { }

  async findAll(id?: number): Promise<Category[]> {
    if (id) {
      return await this.categoryRepository.find({ where: { id } });
    } else {
      return await this.categoryRepository.find();
    }
  }

  async create(CreateCategoryDto: CreateCategoryDto): Promise<Category> {
    // 确保添加的不是重复的
    const category = await this.categoryRepository.findOne({ where: { categoryName: CreateCategoryDto.categoryName } });
    if (category) {
      return category;
    }

    // 获取最大 ID 的记录
    const maxId = await this.categoryRepository.findOne({
      where: {},
      order: { id: 'DESC' }, // 按照 ID 降序排列
    });

    // 确定新的 ID
    const newId = maxId ? maxId.id + 1 : 1;

    const createCategory = {
      ...CreateCategoryDto,
      id: newId,
      createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    }

    return await this.categoryRepository.save(createCategory);
  }

  async delete(id: number): Promise<Category> {
    // 查找要删除的分类
    const Category = await this.categoryRepository.findOne({
      where: { id: id },
    });
    if (!Category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
    await this.categoryRepository.delete(id);
    return Category;
  }

  // 更新分类
  async update(updateCategoryDto: updateCategoryDto): Promise<Category> {
    const { id, categoryName } = updateCategoryDto;
    // 查询 分类 是否存在
    const tag = await this.categoryRepository.findOne({ where: { id } });

    if (!tag) {
      throw new Error('Tag not found');
    }

    // 只更新 tagName 和 updateTime
    await this.categoryRepository.update(id, {
      categoryName,
      updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
    });

    const updatedCategory = await this.categoryRepository.findOne({ where: { id } });

    if (!updatedCategory) {
      throw new Error('Failed to update tag');
    }

    return updatedCategory;
  }

  // 搜索分类
  async searchTags(categoryName?: string, startTime?: string, endTime?: string): Promise<Category[]> {
    if (!categoryName && !startTime && !endTime) {
      return this.categoryRepository.find();
    }

    const query: FindOptionsWhere<Category> = {};

    if (categoryName) {
      query.categoryName = Like(`%${categoryName}%`); // 模糊查询
    }

    if (startTime && endTime) {
      query.createTime = Between(new Date(startTime), new Date(endTime));
    }

    return await this.categoryRepository.find({ where: query });
  }

  // 获取有多少个分类
  async getTagCount(): Promise<number> {
    console.log('1');
    return await this.categoryRepository.count();
  }
}
