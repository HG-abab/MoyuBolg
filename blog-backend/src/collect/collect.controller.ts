import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CollectService } from './collect.service';
import { Collect } from './entities/collect.entity';
import { CreateCollectDto, IsisCheckDto, SearchCollectDto } from './dto/collect.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('collect')
export class CollectController {
  constructor(private readonly collectService: CollectService) { }

  @Get()
  async getCollect(): Promise<Collect[]> {
    return await this.collectService.getCollectList();
  }

  @Get(':id')
  async getIdCollect(@Param('id') id: number): Promise<Collect[]> {
    return await this.collectService.getCollectList(id);
  }

  // 创建
  @Post('create')
  async createCollect(@Body() CreateCollectDto: CreateCollectDto): Promise<Collect> {
    return await this.collectService.createCollect(CreateCollectDto);
  }

  // 是否通过
  @Put('update')
  @UseGuards(AuthGuard)
  async isCheck(@Body() IsisCheckDto: IsisCheckDto): Promise<Collect> {
    return await this.collectService.isCheck(IsisCheckDto);
  }

  // 删除
  @Delete('/delete/:id')
  @UseGuards(AuthGuard)
  async deleteCollect(@Param('id') id: number): Promise<Collect> {
    return await this.collectService.deleteCollect(id);
  }

  // 搜索
  @Post('/search')
  async searchCollect(@Body() searchCollectDto: SearchCollectDto): Promise<Collect[]> {
    return await this.collectService.searchCollect(searchCollectDto);
  }

}
