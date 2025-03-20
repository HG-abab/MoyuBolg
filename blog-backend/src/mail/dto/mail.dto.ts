import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SendMailDto {
  @IsEmail()
  @IsNotEmpty()
  to: string; // 收件人邮箱

  @IsString()
  @IsNotEmpty()
  subject: string; // 邮件主题

  @IsString()
  @IsNotEmpty()
  text: string; // 纯文本内容

  @IsString()
  @IsOptional()
  html?: string; // 可选的 HTML 内容
}