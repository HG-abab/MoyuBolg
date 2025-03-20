// src/auth/auth.service.ts
import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigType } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { Not, Repository } from 'typeorm'
import { User } from '../users/entities/user.entity'
import jwtConfig from '../../jwt.config'
import { JwtPayload, resetPasswordDto, ResetPasswordDto, SignInDto, SignUpDto, SocialLoginDto } from './dto/auth.dto'
import { HashingService } from './hashing.service'
import { MailService } from '../mail/mail.service';



@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>, // 用户仓库
    private readonly mailService: MailService,  // 注入 MailService
    private readonly jwtService: JwtService, // JWT服务
    private readonly hashingService: HashingService, // 哈希服务
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>, // JWT配置
  ) { }



  async signUp(signUpDto: SignUpDto) {
    const { name, password, email } = signUpDto
    const existingUser = await this.userRepository.findOne({ where: [{ name }] })
    if (existingUser) throw new BadRequestException('用户名已存在')

    // 一个邮箱只能注册一个账号 但是第三方登录的email要允许在注册一个邮箱
    const existingEmail = await this.userRepository.findOne({ where: [{ email }] })
    if (existingEmail?.email && existingEmail?.password) throw new BadRequestException('邮箱已存在')

    const hashedPassword = await this.hashingService.hash(password)
    const user = this.userRepository.create({
      ...signUpDto,
      password: hashedPassword,
    })
    await this.userRepository.save(user)
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    }
  }

  async signIn(signInDto: SignInDto) {
    const { account, password } = signInDto;

    if (!password) {
      throw new BadRequestException('Password cannot be empty');
    }
    // 查询用户（用户名或邮箱）
    const user = await this.userRepository.findOne({
      where: [{ email: account }, { name: account }]
    });
    if (!user || !user.password) {
      throw new BadRequestException('User does not exist or password is missing');
    }
    // 验证密码
    const isPasswordValid = await this.hashingService.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Password is incorrect');
    }

    // 生成 JWT 令牌
    const payload = { sub: user.id, email: user.email, name: user.name };
    const token = this.jwtService.sign(payload, { secret: this.jwtConfiguration.secret, expiresIn: '7d' });

    return {
      message: 'Login successful',
      user: { id: user.id, name: user.name, email: user.email },
      token
    };
  }

  async socialLogin(socialLoginDto: SocialLoginDto) {
    const { provider, providerId, name, email, avatar } = socialLoginDto;

    // 查找是否已有该用户
    let user = await this.userRepository.findOne({ where: { providerId, provider } });

    // 如果用户不存在，则创建新用户
    if (!user) {
      user = this.userRepository.create({
        name,
        email,
        avatar,
        provider,
        providerId,
      });
      await this.userRepository.save(user);
    }

    // 生成 JWT 令牌
    const payload = { sub: user.id, email: user.email, name: user.name };
    const token = this.jwtService.sign(payload, {
      secret: this.jwtConfiguration.secret,
      expiresIn: '24h',
    });

    return token;
  }

  // 通过邮件发送重置密码链接
  async sendResetPasswordLink(resetPasswordDto: resetPasswordDto) {
    const { email } = resetPasswordDto;
    // 且找到的user的password不为空
    const user = await this.userRepository.findOne({
      where: {
        email,
        password: Not('')
      }
    });
    if (!user) {
      throw new BadRequestException('该邮箱地址并没有创建账号');
    }

    const resetToken = this.jwtService.sign({ sub: user.id }, {
      secret: this.jwtConfiguration.secret,
      expiresIn: '15m',
    })

    // 发送重置密码链接到用户邮箱
    const resetLink = `http://localhost:5179/reset?token=${resetToken}`;

    await this.mailService.sendMail({
      to: email,
      subject: '重置密码',
      text: resetLink,
    });
    return { message: '重置密码链接已发送到您的邮箱' };
  }

  // 重置密码
  async resetPassword(token: string, ResetPasswordDto: ResetPasswordDto) {
    const { newPassword } = ResetPasswordDto;

    // 解码并验证 token
    let userId: number;
    try {
      const payload: JwtPayload = this.jwtService.verify(token, {
        secret: this.jwtConfiguration.secret,
      });
      userId = payload.sub;
    } catch {
      throw new BadRequestException('无效的 token');
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new BadRequestException('找不到用户');
    }

    // 加密新密码
    const hashedNewPassword = await this.hashingService.hash(newPassword);

    // 更新用户密码
    user.password = hashedNewPassword;
    await this.userRepository.save(user);

    return {
      message: '密码已重置',
      email: user.email,
    };

  }
}
