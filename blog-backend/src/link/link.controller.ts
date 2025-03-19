import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { LinkService } from './link.service';
import { Link } from './entities/link.entity';
import { CreateLinkDto, SearchLinkDto, UpdateLinkDto } from './dto/link.dto';

@Controller('link')
export class LinkController {
  constructor(private readonly linkService: LinkService) { }

  // 获取
  @Get()
  async getLink(): Promise<Link[]> {
    return this.linkService.getLinks();
  }

  @Get(':id')
  async getLinkById(@Param('id') id: number): Promise<Link[]> {
    return this.linkService.getLinks(id);
  }

  // 创建
  @Post('/create')
  async createLink(@Body() CreateLinkDto: CreateLinkDto): Promise<Link> {
    return this.linkService.createLink(CreateLinkDto);
  }

  //是否通过
  @Put('/isCheck')
  async isCheck(@Body() UpdateLinkDto: UpdateLinkDto): Promise<Link> {
    return this.linkService.checkLink(UpdateLinkDto);
  }

  //删除
  @Delete('/delete/:id')
  async deleteLink(@Param('id') id: number): Promise<Link> {
    return this.linkService.deleteLink(id);
  }

  // 搜索
  @Post('/search')
  async searchLink(@Body() SearchLinkDto: SearchLinkDto): Promise<Link[]> {
    return this.linkService.searchLink(SearchLinkDto);
  }

}
