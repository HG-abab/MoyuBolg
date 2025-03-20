import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { SendMailDto } from './dto/mail.dto';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: this.configService.get<boolean>('SMTP_SECURE'), // true for 465, false for 587
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });
  }

  async sendMail(sendMailDto: SendMailDto): Promise<void> {
    const { to, subject, text, html } = sendMailDto;
    try {
      const info = await this.transporter.sendMail({
        from: `"NestJS 邮件" <${this.configService.get<string>('SMTP_USER')}>`, // 发件人
        to, // 收件人
        subject, // 主题
        text, // 纯文本
        html, // HTML 内容（可选）
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('邮件发送失败:', error.message);
      } else {
        console.error('邮件发送失败:', error);
      }
      throw new Error('邮件发送失败');
    }
  }
}
