// src/users/users.controller.ts
import { Body, Controller, Delete, Get, Param, Put, UseGuards } from '@nestjs/common'
import { UsersService } from './users.service'
import { isCheckedUserDto } from './dto/user.dto'
import { User } from './entities/user.entity'
import { AuthGuard } from 'src/auth/auth.guard'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  findAll() {
    return this.usersService.findAll()
  }

  // 根据id查找用户
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }

  // 删除
  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: number) {
    return this.usersService.remove(id)
  }


  @Put('update/isAdmin')
  @UseGuards(AuthGuard)
  async updateIsAdmin(@Body() isCheckedUserDto: isCheckedUserDto): Promise<User> {
    return this.usersService.updateIsAdmin(isCheckedUserDto)
  }
}
