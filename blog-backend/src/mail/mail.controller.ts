import { Body, Controller, Post } from '@nestjs/common';
import { MailService } from './mail.service';
import { SendMailDto } from './dto/mail.dto';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) { }

  @Post('send')
  async sendMail(@Body() body: SendMailDto) {
    await this.mailService.sendMail(body);
    return {
      user: body.to,
      text: body.text,
      message: '邮件已发送'
    }
  }

}
