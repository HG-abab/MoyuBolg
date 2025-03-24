import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WebsiteInformation } from './entities/information.entity';
import { BgUrl } from './entities/bgurl.entity';
import { InformationDto, CreateBgUrlDto } from './dto/information.dto';

@Injectable()
export class InformationService {
  constructor(
    // 注入 Information 实体的存储库
    @InjectRepository(WebsiteInformation)
    private readonly informationRepository: Repository<WebsiteInformation>,
  ) { }

  // 更新网站信息
  async updateStationMaster(informationDto: InformationDto): Promise<WebsiteInformation> {
    const newData = { id: 1, ...informationDto }; // 确保 ID 为 1
    return await this.informationRepository.save(newData); // TypeORM `save()` 自动插入或更新
  }

  // 获取网站信息
  async getStationMaster(): Promise<WebsiteInformation | null> {
    return await this.informationRepository.findOne({ where: { id: 1 } });
  }
}

@Injectable()
export class BgUrlService {
  constructor(
    @InjectRepository(BgUrl)
    private readonly informationRepository: Repository<BgUrl>,
  ) { }

  // 处理更新背景图逻辑
  async updateBgUrl(createBgUrlDto: CreateBgUrlDto): Promise<BgUrl> {
    const { url, size, type, userId, sortOrder } = createBgUrlDto;

    // 获取最大 ID 的记录
    const maxBgUrl = await this.informationRepository.findOne({
      where: {},
      order: { id: 'DESC' }, // 按照 ID 降序排列
    });

    // 确定新的 ID
    const newId = maxBgUrl ? maxBgUrl.id + 1 : 1;

    // 创建 BgUrl 实体对象并保存
    const bgUrl = new BgUrl();
    bgUrl.id = newId; // 设置新的 ID
    bgUrl.url = url; // 设置图片 URL
    bgUrl.size = size; // 设置文件大小
    bgUrl.type = type; // 设置文件类型
    bgUrl.userId = userId; // 设置用户 ID
    bgUrl.sortOrder = sortOrder; // 设置排序顺序
    bgUrl.createTime = new Date().toISOString(); // 设置创建时间为当前时间

    // 保存到数据库
    const savedBgUrl = await this.informationRepository.save(bgUrl);

    // 返回保存后的 URL 和 ID
    return savedBgUrl;
  }

  // 获取所有背景图，按照 sortOrder 升序排序
  async getBgUrl(): Promise<BgUrl[]> {
    return await this.informationRepository.find({});
  }


  // 通过id删除背景图
  async deleteBgUrl(id: number): Promise<BgUrl> {
    const bgUrl = await this.informationRepository.findOne({ where: { id } });
    if (!bgUrl) {
      throw new NotFoundException(`BgUrl with id ${id} not found`);
    }
    return await this.informationRepository.remove(bgUrl); // 删除记录
  }

  // 排序 将传过来的数据更新新到数据库
  async updateSortOrder(bgUrls: CreateBgUrlDto[]): Promise<BgUrl[]> {
    if (!bgUrls || bgUrls.length === 0) {
      throw new BadRequestException('No bgUrls provided');
    }

    // 清空数据库
    await this.informationRepository.clear();

    // 按照传入数据的顺序保存，无需排序，直接保存
    const savedBgUrls = await this.informationRepository.save(bgUrls);

    console.log('Saved bgUrls:', savedBgUrls);

    return savedBgUrls; // 返回保存后的数据
  }

}
