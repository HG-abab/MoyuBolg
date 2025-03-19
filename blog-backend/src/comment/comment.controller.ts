import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { CommentService } from './comment.service';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto, DeleteCommentDto, IsCommentCheckDto, SearchCommentByTypeIdDto, SearchCommentDto } from './dto/comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) { }

  // 获取
  @Get()
  async getComment(): Promise<Comment[]> {
    return this.commentService.getCommentList()
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
  async isCheck(@Body() IsCommentCheckDto: IsCommentCheckDto): Promise<Comment> {
    return this.commentService.isCheck(IsCommentCheckDto)
  } o

  // 删除评论
  @Delete('/delete')
  async deleteComment(@Body() DeleteCommentDto: DeleteCommentDto): Promise<Comment> {
    return this.commentService.deleteComment(DeleteCommentDto)
  }

  // 搜索
  @Post('/search')
  async searchComment(@Body() SearchCommentDto: SearchCommentDto): Promise<Comment[]> {
    return this.commentService.searchComments(SearchCommentDto)
  }

}
