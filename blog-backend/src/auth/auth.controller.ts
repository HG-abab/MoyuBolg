// src/auth/auth.controller.ts
import { Body, Controller, Get, Post, Query, Req, Res, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { ResetPasswordDto, resetPasswordDto, SignInDto, SignUpDto, SocialLoginDto } from './dto/auth.dto'
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
    try {
      const socialUser = req.user as SocialLoginDto;
      const loginDto: SocialLoginDto = {
        provider: 'github',
        providerId: socialUser.providerId,
        name: socialUser.name,
        avatar: socialUser.avatar || '',
        email: socialUser.email
      };
      const userInfo = Buffer.from(JSON.stringify({
        name: socialUser.name,
        avatar: socialUser.avatar || ''
      })).toString('base64');
      const token = await this.authService.socialLogin(loginDto);
      const frontendUrl = process.env.FRONTEND_URL
      return res.redirect(`${frontendUrl}/auth?token=${token}&user=${userInfo}`);
    } catch (error) {
      const err = error as { oauthError?: { code?: string } };
      if (err?.oauthError?.code === 'ECONNRESET') {
        return res.status(502).json({ message: "网络错误，请稍后重试" });
      }
    }
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
    const userInfo = Buffer.from(JSON.stringify({
      name: socialUser.name,
      avatar: socialUser.avatar || ''
    })).toString('base64');
    const token = await this.authService.socialLogin(loginDto);
    const frontendUrl = process.env.FRONTEND_URL
    return res.redirect(`${frontendUrl}/auth?token=${token}&user=${userInfo}`);
  }

  @Post('send-reset')
  async sendResetPasswordLink(@Body() email: resetPasswordDto) {
    const response = await this.authService.sendResetPasswordLink(email);
    return response;
  }

  @Post('reset-password')
  async resetPassword(
    @Query('token') token: string,  // 从 URL 查询参数中获取 token
    @Body() resetPasswordDto: ResetPasswordDto, // 获取请求体中的 ResetPasswordDto
  ) {
    // 调用 AuthService 的 resetPassword 方法
    return await this.authService.resetPassword(token, resetPasswordDto);
  }
}
