import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from './entities/category.entity'
import { CreateCategoryDto, updateCategoryDto } from './dto/category.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }


  @Get()
  async getAllCategory(): Promise<Category[]> {
    return this.categoryService.findAll();
  }

  @Get('/count')
  async count(): Promise<number> {
    return this.categoryService.getTagCount();
  }

  @Get(':id')
  async getIdAllCategory(@Param('id') id: number): Promise<Category[]> {
    return this.categoryService.findAll(id);
  }

  // 新增
  @Post('/createcategory')
  async create(@Body() CreateCategoryDto: CreateCategoryDto): Promise<Category> {
    return await this.categoryService.create(CreateCategoryDto);
  }

  // 删除
  @Delete('/deletecategory/:id')
  @UseGuards(AuthGuard)
  async delete(@Param('id') id: number): Promise<Category> {
    return await this.categoryService.delete(id);
  }

  // 修改
  @Put('/updatecategory')
  async update(@Body() updateCategoryDto: updateCategoryDto): Promise<Category> {
    return await this.categoryService.update(updateCategoryDto);
  }

  // 查询
  @Post('/search')
  async search(@Body() searchParams: { categoryName?: string; startTime?: string; endTime?: string } = {}): Promise<Category[]> {
    const { categoryName, startTime, endTime } = searchParams;
    return await this.categoryService.searchTags(categoryName, startTime, endTime);
  }

  // 获取有多少个分类

}
