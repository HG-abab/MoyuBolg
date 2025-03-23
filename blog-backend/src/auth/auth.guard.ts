import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { JwtPayload, SocialLoginDto } from './dto/auth.dto'; // 导入定义的接口

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,  // 直接注入 ConfigService
  ) { }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('缺少授权令牌');
    }

    const payload = this.jwtService.verify<JwtPayload & SocialLoginDto>(token, {
  secret: this.configService.get<string>('JWT_SECRET'),
});


    // 检查是否通过审核
    if (!payload.isChecked) {
      throw new ForbiddenException('账号未通过审核');
    }

    // 将 payload 添加到 request 对象中，以便后续中间件或控制器使用
    request.user = payload;
    return true;
  }

  private extractToken(request: Request): string | null {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.split(' ')[1];
  }
}
