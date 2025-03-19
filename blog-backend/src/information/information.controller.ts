import { Controller, Post, Body, BadRequestException, Get, Delete, Param, Put } from '@nestjs/common';
import { InformationService, BgUrlService } from './information.service';
import { InformationDto, CreateBgUrlDto } from './dto/information.dto';

@Controller('information')
export class InformationController {
  constructor(
    private readonly informationService: InformationService,
    private readonly bgUrlService: BgUrlService,
  ) { }

  @Post('/stationmaster')
  async updateStationMaster(@Body() informationDto: InformationDto) {
    // 覆盖数据库中的数据（id 固定为 1）
    return await this.informationService.updateStationMaster(informationDto);
  }

  @Get('/getstation')
  async getStationMaster() {
    const data = await this.informationService.getStationMaster();

    if (!data) {
      throw new BadRequestException('未找到信息');
    }

    return data;
  }


  @Post('/updatebgurl')
  async updateBgUrl(@Body() bgUrlDto: CreateBgUrlDto) {
    const savedBgUrl = await this.bgUrlService.updateBgUrl(bgUrlDto);
    return savedBgUrl;  // 返回保存后的 URL 和 ID
  }

  @Get('/getbgurl')
  async getBgUrl() {
    const data = await this.bgUrlService.getBgUrl();
    if (!data) {
      throw new BadRequestException('未找到背景图信息');
    }
    return data;
  }

  // 删除图片(id)
  @Delete('/deletebgurl/:id')
  async deleteBgUrl(@Param('id') id: number) {
    return await this.bgUrlService.deleteBgUrl(id);
  }

  // 排序
  @Put('sort')
  async updateSortOrder(@Body() bgUrlDto: CreateBgUrlDto[]) {
    return await this.bgUrlService.updateSortOrder(bgUrlDto);
  }

}



