import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { TagService } from './tag.service';
import { createTagDto, TagResponseDto, updateTagDto } from './dto/tag.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) { }

  // 获取所有标签
  @Get()
  async getTags(): Promise<createTagDto[]> {
    return await this.tagService.findAll();
  }

  // 新增
  @Post('/createTag')
  async create(@Body() createTagDto: createTagDto): Promise<TagResponseDto> {
    return await this.tagService.create(createTagDto);
  }

  // 删除
  @Delete('/deleteTag/:id')
  @UseGuards(AuthGuard)
  async delete(@Param('id') id: number): Promise<TagResponseDto> {
    return await this.tagService.delete(id);
  }

  // 修改
  @Put('/updateTag')
  async update(@Body() updateTagDto: updateTagDto): Promise<TagResponseDto> {
    return await this.tagService.update(updateTagDto);
  }

  // 查询
  @Post('/search')
  async search(@Body() searchParams: { tagName?: string; startTime?: string; endTime?: string } = {}): Promise<createTagDto[]> {
    const { tagName, startTime, endTime } = searchParams;
    return await this.tagService.searchTags(tagName, startTime, endTime);
  }


}
