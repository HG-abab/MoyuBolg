import { IsNotEmpty, IsString } from 'class-validator';

// 注册接口
export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  name: string
  email: string
  password: string
}

// 登录接口
export class SignInDto {
  @IsString()
  @IsNotEmpty()
  //邮箱/用户名
  account: string
  password: string
}