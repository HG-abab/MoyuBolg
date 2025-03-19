// src/auth/auth.service.ts
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigType } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '../users/entities/user.entity'
import jwtConfig from '../../jwt.config'
import { SignInDto, SignUpDto } from './dto/auth.dto'
import { HashingService } from './hashing.service'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly hashingService: HashingService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) { }

  async signUp(signUpDto: SignUpDto) {
    const { name, password } = signUpDto
    const existingUser = await this.userRepository.findOne({ where: [{ name }] })
    if (existingUser)
      throw new UnauthorizedException('User already exists')

    const hashedPassword = await this.hashingService.hash(password)
    const user = this.userRepository.create({
      ...signUpDto,
      password: hashedPassword,
    })
    return this.userRepository.save(user)
  }

  async signIn(signInDto: SignInDto) {
    const { account, password } = signInDto
    // account可以是用户名或邮箱

    // 先查询用户是否存在
    const user = await this.userRepository.findOne({ where: [{ email: account }, { name: account }] })
    if (!user) {
      throw new UnauthorizedException('User does not exist')
    }

    // 验证密码是否正确
    const isPasswordValid = await this.hashingService.compare(password, user.password)
    if (!isPasswordValid) {
      throw new UnauthorizedException('Password is incorrect')
    }

    // 生成token
    // 生成 JWT 令牌
    const payload = { sub: user.id, email: user.email, name: user.name }
    const token = this.jwtService.sign(payload, { secret: this.jwtConfiguration.secret, expiresIn: '7d' })

    // 返回 用户名/邮箱 + token
    return {
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      token
    }
  }
}
