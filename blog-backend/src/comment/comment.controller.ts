import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto, DeleteCommentDto, IsCommentCheckDto, SearchCommentByTypeIdDto, SearchCommentDto } from './dto/comment.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) { }

  // 获取
  @Get()
  async getComment(): Promise<Comment[]> {
    return this.commentService.getCommentList()
  }

  // 通过用户名获取
  @Get('/:id')
  async getCommentById(@Param('id') id: string): Promise<Comment[]> {
    return this.commentService.getCommentListByUserName(id)
  }

  // 获取评论数
  @Get('/count')
  async getCommentCount(): Promise<number> {
    return this.commentService.getCommentCount()
  }

  // 获取文章或者留言的评论数
  @Post('/TypeCount')
  async getCommentCountByType(@Body() SearchCommentByTypeIdDto: SearchCommentByTypeIdDto): Promise<Comment[]> {
    return this.commentService.getCommentCountByType(SearchCommentByTypeIdDto)
  }

  // 创建
  @Post('/create')
  async createComment(@Body() createCommentDto: CreateCommentDto): Promise<Comment> {
    return this.commentService.createComment(createCommentDto)
  }

  // 是否通过
  @Put('/isCheck')
  @UseGuards(AuthGuard)
  async isCheck(@Body() IsCommentCheckDto: IsCommentCheckDto): Promise<Comment> {
    return this.commentService.isCheck(IsCommentCheckDto)
  } o

  // 删除评论
  @Delete('/delete')
  @UseGuards(AuthGuard)
  async deleteComment(@Body() DeleteCommentDto: DeleteCommentDto): Promise<Comment> {
    return this.commentService.deleteComment(DeleteCommentDto)
  }

  // 搜索
  @Post('/search')
  async searchComment(@Body() SearchCommentDto: SearchCommentDto): Promise<Comment[]> {
    return this.commentService.searchComments(SearchCommentDto)
  }

}
