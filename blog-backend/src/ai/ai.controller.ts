import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AiService } from './ai.service';
import { AiRequestDto } from './dto/ai.dto';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) { }

  @Post('continue')
  async continueWriting(
    @Body() dto: AiRequestDto,
    @Res() res: Response
  ) {
    return this.aiService.continueWriting(dto.content, res);
  }

  @Post('polish')
  async polish(
    @Body() dto: AiRequestDto,
    @Res() res: Response
  ) {
    return this.aiService.polish(dto.content, res);
  }

  @Post('summarize')
  async summarize(
    @Body() dto: AiRequestDto,
    @Res() res: Response
  ) {
    return this.aiService.summarize(dto.content, res);
  }
  // 专门用来回复用户消息的接口
  @Post('reply')
  async reply(
    @Body() dto: AiRequestDto,
    @Res() res: Response
  ) {
    return this.aiService.reply(dto.content, res);
  }
  
}
