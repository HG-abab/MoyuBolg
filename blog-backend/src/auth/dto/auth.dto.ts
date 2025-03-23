import {  IsNotEmpty, IsString } from 'class-validator';
// 注册接口
export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  name: string
  @IsString()
  @IsNotEmpty()
  email: string
  @IsString()
  @IsNotEmpty()
  password: string
}

// 登录接口
export class SignInDto {
  @IsString()
  @IsNotEmpty()
  //邮箱/用户名
  account: string
  @IsString()
  @IsNotEmpty()
  password: string
}

// 第三方登录回调
export class OAuthCallbackDto {
  @IsString()
  @IsNotEmpty()
  code: string;
  @IsString()
  state?: string; // 可选，用于 CSRF 防护
}

//  第三方登录用户信息
export class SocialLoginDto {
  provider: 'github' | 'gitee';
  providerId: string;
  name: string;
  email: string;
  avatar: string;
}


export interface GithubProfile {
  _json: {
    id: string;
    login: string;
    avatar_url?: string;
  };
  emails?: { value: string }[];
}

export interface GiteeProfile {
  id: string;
  login: string;
  email?: string;
  avatar_url?: string;
}

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}

export class resetPasswordDto {
  @IsString()
  @IsNotEmpty()
  email: string
}

// token 密码
export class TokenPasswordDto {
  @IsString()
  @IsNotEmpty()
  token: string
}

export interface JwtPayload {
  sub: number;        // 用户 ID
  email: string;      // 用户邮箱
  name: string;       // 用户名
  isChecked: boolean; // 是否通过审核
  exp?: number;       // 过期时间（可选）
  iat?: number;       // 签发时间（可选）
}
