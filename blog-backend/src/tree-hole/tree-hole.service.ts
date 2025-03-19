import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TreeHole } from './entities/tree-hole.entity';
import { Between, FindOptionsWhere, Like, Repository } from 'typeorm';
import { CreateTreeHoleDto, isCheckTreeHoleDto, SearchTreeHoleDto } from './dto/tree-hole.dto';


@Injectable()
export class TreeHoleService {
  constructor(
    @InjectRepository(TreeHole) private readonly treeHoleRepository: Repository<TreeHole>,
  ) { }

  // 获取
  async getTreeHoleList(id?: number): Promise<TreeHole[]> {
    if (id) {
      const TreeHole = await this.treeHoleRepository.findOne({ where: { id } });
      return TreeHole ? [TreeHole] : [];
    } else {
      return await this.treeHoleRepository.find();
    }
  }
  // 创建
  async createTreeHole(CreateTreeHoleDto: CreateTreeHoleDto): Promise<TreeHole> {
    const { userName, content, avatar } = CreateTreeHoleDto;

    const maxId = await this.treeHoleRepository.findOne({
      where: {},
      order: { id: 'DESC' },
    })
    const id = maxId ? maxId.id + 1 : 1;

    const treeHole = {
      id,
      userName,
      avatar,
      content,
      isCheck: false,
      createTime: new Date(),
      updateTime: new Date(),
    }
    return await this.treeHoleRepository.save(treeHole);
  }

  // 是否通过
  async checkTreeHole(isCheckTreeHoleDto: isCheckTreeHoleDto): Promise<TreeHole> {
    const { id, isCheck } = isCheckTreeHoleDto;
    const treeHole = await this.treeHoleRepository.findOne({ where: { id } });
    if (!treeHole) {
      throw new NotFoundException(`TreeHole with id ${id} not found`);
    }
    treeHole.isCheck = isCheck;
    return await this.treeHoleRepository.save(treeHole);
  }

  // 删除
  async deleteTreeHole(id: number): Promise<TreeHole> {
    const treeHole = await this.treeHoleRepository.findOne({ where: { id } });
    if (!treeHole) {
      throw new NotFoundException(`TreeHole with id ${id} not found`);
    }
    return await this.treeHoleRepository.remove(treeHole);
  }

  // 搜索
  async searchTreeHole(searchTreeHoleDto: SearchTreeHoleDto): Promise<TreeHole[]> {
    const { userName, isCheck, startTime, endTime } = searchTreeHoleDto;
    if (!userName && isCheck === undefined && !startTime && !endTime) {
      return await this.treeHoleRepository.find();
    }

    const where: FindOptionsWhere<TreeHole> = {};
    if (userName) {
      where.userName = Like(`%${userName}%`);
    }
    if (isCheck !== undefined) {
      where.isCheck = isCheck;
    }
    if (startTime && endTime) {
      where.createTime = Between(new Date(startTime), new Date(endTime));
    }

    return await this.treeHoleRepository.find({ where });
  }

}
