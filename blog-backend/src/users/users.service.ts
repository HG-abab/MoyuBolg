// src/users/users.service.ts
import { BadGatewayException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './entities/user.entity'
import { isCheckedUserDto, UserDto } from './dto/user.dto'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  findAll(): Promise<User[]> {
    return this.userRepository.find()
  }

  // 根据id查找用户
  async findOne(id: number): Promise<User> {
    if (!id) {
      throw new BadGatewayException('用户id不能为空')
    }
    const user = await this.userRepository.findOne({
      where: { id },
    })
    if (!user) {
      throw new BadGatewayException('用户不存在')
    }
    return user
  }

  // 删除
  async remove(id: number): Promise<User> {
    if (!id) {
      throw new BadGatewayException('用户id不能为空')
    }
    const user = await this.userRepository.findOne({
      where: { id },
    })
    if (!user) {
      throw new BadGatewayException('用户不存在')
    }
    return await this.userRepository.remove(user)
  }

  // 修改用户信息
  async upUserdate(UserDto: UserDto): Promise<User> {
    const { id, name, copy, avatar, giteeLink, githubLink, webmasterProfileBackground } = UserDto;
    let user = await this.userRepository.findOne({
      where: { id },
    })
    if (!user) {
      throw new BadGatewayException('用户不存在')
    }
    await this.userRepository.update(id, {
      name,
      copy,
      avatar,
      giteeLink,
      githubLink,
      webmasterProfileBackground
    })
    user = await this.userRepository.findOne({
      where: { id },
    })
    if (!user) {
      throw new BadGatewayException('用户不存在')
    }
    return user
  }

  // 是否是管理员
  async updateIsAdmin(isCheckedUserDto: isCheckedUserDto): Promise<User> {
    const { id, isChecked } = isCheckedUserDto;
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new BadGatewayException('用户不存在');
    }
    // 更新用户并保存
    user.isChecked = isChecked;
    // 返回更新后的用户
    return this.userRepository.save(user);
  }

}
