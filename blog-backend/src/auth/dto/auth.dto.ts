import { IsNotEmpty, IsString } from 'class-validator';
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
