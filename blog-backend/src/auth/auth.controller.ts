// src/auth/auth.controller.ts
import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { SignInDto, SignUpDto, SocialLoginDto } from './dto/auth.dto'
import { AuthGuard } from '@nestjs/passport'
import { Request, Response } from 'express'

// 扩展Express的Request类型
declare module 'express' {
  interface Request {
    user?: SocialLoginDto;
  }
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('signUp')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto)
  }

  @Post('signIn')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto)
  }

  @Get('github')
  @UseGuards(AuthGuard('github'))
  githubLogin() {
    return { message: 'Redirecting to GitHub for authentication' }
  }
  // GitHub 回调
  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubCallback(@Req() req: Request, @Res() res: Response) {
    const socialUser = req.user as SocialLoginDto;
    const loginDto: SocialLoginDto = {
      provider: 'github',
      providerId: socialUser.providerId,
      name: socialUser.name,
      avatar: socialUser.avatar || '',
      email: socialUser.email
    };
    const token = await this.authService.socialLogin(loginDto);
    return res.redirect(`http://localhost:3000?token=${token}`);
  }

  // Gitee 登录重定向
  @Get('gitee')
  @UseGuards(AuthGuard('gitee'))
  giteeLogin() {
    return { message: 'Redirecting to Gitee for authentication' }
  }

  // Gitee 回调
  @Get('gitee/callback')
  @UseGuards(AuthGuard('gitee'))
  async giteeCallback(@Req() req: Request, @Res() res: Response) {
    const socialUser = req.user as SocialLoginDto;  // 使用类型断言
    const loginDto: SocialLoginDto = {
      provider: 'gitee',
      providerId: socialUser.providerId,
      name: socialUser.name,
      avatar: socialUser.avatar || '',
      email: socialUser.email
    };
    const token = await this.authService.socialLogin(loginDto);
    return res.redirect(`http://localhost:3000?token=${token}`);
  }
}
