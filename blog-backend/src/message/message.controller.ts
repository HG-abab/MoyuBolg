import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto, IsCollectDto, IsLikeDto, SearchMessageDto, UpdateMessageDto } from './dto/message.dto';
import { Message } from './entities/message.entity'

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) { }


  // 获取
  @Get(':id')
  async getMessage(@Param('id') id: number): Promise<Message[]> {
    // 根据 id 获取消息
    return this.messageService.getMessage(id);
  }

  @Get()
  async getAllMessages(): Promise<Message[]> {
    // 获取所有消息
    return this.messageService.getMessage();
  }

  // 创建
  @Post('/create')
  async createMessage(@Body() CreateMessageDto: CreateMessageDto): Promise<Message> {
    return this.messageService.createMessage(CreateMessageDto);
  }

  // 更新审核状态
  @Put('/updateIsCheck')
  async updateCheckStatus(@Body() UpdateMessageDto: UpdateMessageDto): Promise<Message> {
    return this.messageService.updateCheckStatus(UpdateMessageDto);
  }

  // 删除
  @Delete('/delete/:id')
  async deleteMessage(@Param('id') id: number) {
    return this.messageService.deleteMessage(id);
  }
  // 搜索
  @Post('/search')
  async searchMessage(@Body() SearchMessageDto: SearchMessageDto): Promise<Message[]> {
    return this.messageService.searchMessage(SearchMessageDto);
  }

  // 点赞
  @Put('/likeArticle')
  async isLike(@Body() IsLikeDto: IsLikeDto): Promise<void> {
    return this.messageService.isLike(IsLikeDto)
  }

  // 查询是否点赞
  @Post('/isLikeArticle')
  async isLiked(@Body() IsLikeDto: IsLikeDto): Promise<boolean> {
    return this.messageService.isLiked(IsLikeDto)
  }

  // 收藏
  @Put('/collectArticle')
  async isCollect(@Body() IsCollectDto: IsCollectDto): Promise<void> {
    return this.messageService.isCollect(IsCollectDto)
  }
  // 查询是否收藏
  @Post('/isCollectArticle')
  async isFavorite(@Body() IsCollectDto: IsCollectDto): Promise<boolean> {
    return this.messageService.isFavorite(IsCollectDto)
  }


}
