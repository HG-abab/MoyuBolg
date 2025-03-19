import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { TreeHoleService } from './tree-hole.service';
import { TreeHole } from './entities/tree-hole.entity';
import { CreateTreeHoleDto, isCheckTreeHoleDto, SearchTreeHoleDto } from './dto/tree-hole.dto';


@Controller('tree-hole')
export class TreeHoleController {
  constructor(private readonly treeHoleService: TreeHoleService) { }

  @Get()
  async getTreeHoleList(): Promise<TreeHole[]> {
    return this.treeHoleService.getTreeHoleList();
  }

  @Get(':id')
  async getTreeHoleById(@Param('id') id: number): Promise<TreeHole[]> {
    return this.treeHoleService.getTreeHoleList(id);
  }

  // 创建
  @Post('/create')
  async createTreeHole(@Body() CreateTreeHoleDto: CreateTreeHoleDto): Promise<TreeHole> {
    return this.treeHoleService.createTreeHole(CreateTreeHoleDto);
  }

  // 是否通过
  @Put('isCheck')
  async isCheck(@Body() isCheckTreeHoleDto: isCheckTreeHoleDto): Promise<TreeHole> {
    return this.treeHoleService.checkTreeHole(isCheckTreeHoleDto);
  }

  // 删除
  @Delete('/delete/:id')
  async deleteTreeHole(@Param('id') id: number): Promise<TreeHole> {
    return this.treeHoleService.deleteTreeHole(id);
  }

  // 搜索
  @Post('/search')
  async searchTreeHole(@Body() searchTreeHoleDto: SearchTreeHoleDto): Promise<TreeHole[]> {
    return this.treeHoleService.searchTreeHole(searchTreeHoleDto);
  }

}
