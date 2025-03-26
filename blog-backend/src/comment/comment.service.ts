import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { CreateCommentDto, DeleteCommentDto, IsCommentCheckDto, SearchCommentByTypeIdDto, SearchCommentDto } from './dto/comment.dto';
import { Article } from 'src/article/entities/article.entity';
import { Message } from 'src/message/entities/message.entity'
import { User } from 'src/users/entities/user.entity';


@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Article) private readonly articleRepository: Repository<Article>,
    @InjectRepository(Message) private readonly messageRepository: Repository<Message>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) { }

  // 获取
  async getCommentList(): Promise<Comment[]> {
    return await this.commentRepository.find();
  }

  // 通过用户名获取
  async getCommentListByUserName(userName: string): Promise<Comment[]> {
    const commentList = await this.commentRepository.find({ where: { commentUserName: userName } });
    if (!commentList) {
      throw new NotFoundException('没有找到评论');
    }
    return commentList;
  }

  // 创建
  async createComment(createCommentDto: CreateCommentDto): Promise<Comment> {
    const { type, typeId, commentContent, commentUserName, parentId, Avatar, commentTitle } = createCommentDto;

    // 校验父评论（如果是子评论）
    if (parentId) {
      const parentComment = await this.commentRepository.findOne({ where: { id: parentId } });
      if (!parentComment) {
        throw new NotFoundException('Parent comment not found');
      }
      // 父评论的 评论数+1
      parentComment.commentCount += 1;
      await this.commentRepository.save(parentComment);
    }

    const maxId = await this.commentRepository.findOne({
      where: {},
      order: { id: 'DESC' },
    })
    const newId = maxId ? maxId.id + 1 : 1;
    const newComment = {
      id: newId,
      type,
      Avatar,
      typeId,
      commentContent,
      commentTitle,
      commentUserName,
      createTime: new Date(),
      isCheck: false,
      parentId: parentId || undefined,
    }

    const comment = await this.commentRepository.save(newComment);
    // 是文章类型的话 对文章表的评论数+1
    if (type === 1) {
      const article = await this.articleRepository.findOne({ where: { id: typeId } });
      if (!article) {
        throw new NotFoundException('Article not found');
      }
      const user = await this.userRepository.findOne({ where: { name: article.userName } });
      if (user) {
        user.commentCount += 1;
        await this.userRepository.save(user);
      }
      article.commentsCount += 1;
      await this.articleRepository.save(article);
    } else {
      // 留言
      const message = await this.messageRepository.findOne({ where: { id: typeId } });
      if (!message) {
        throw new NotFoundException('Message not found');
      }
      const user = await this.userRepository.findOne({ where: { name: comment.commentUserName } });
      if (user) {
        user.commentCount += 1;
        await this.userRepository.save(user);
      }
      message.commentsCount += 1;
      await this.messageRepository.save(message);
    }

    // 保存评论
    return comment
  }

  // 是否通过
  async isCheck(IsCommentCheckDto: IsCommentCheckDto): Promise<Comment> {
    const { id, isCheck } = IsCommentCheckDto;
    const comment = await this.commentRepository.findOne({ where: { id } });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    comment.isCheck = isCheck;
    return await this.commentRepository.save(comment);
  }

  async deleteComment(DeleteCommentDto: DeleteCommentDto): Promise<Comment> {
    const { id, type, typeId } = DeleteCommentDto;

    // 查找母评论
    const comment = await this.commentRepository.findOne({ where: { id } });

    // 如果母评论不存在，抛出异常
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    // 递归查找所有子评论（包括嵌套的子评论）
    const allChildComments = await this.findAllChildComments(id);

    // 计算删除的评论总数（父评论 + 所有子评论）
    const totalDeletedComments = 1 + allChildComments.length;

    // 删除所有子评论
    if (allChildComments.length > 0) {
      await this.commentRepository.remove(allChildComments);
    }

    // 删除母评论
    await this.commentRepository.remove(comment);

    // 更新父评论的 commentCount（如果当前评论有父评论）
    if (comment.parentId !== null) {
      const parentComment = await this.commentRepository.findOne({
        where: { id: comment.parentId },
      });
      if (parentComment) {
        parentComment.commentCount -= totalDeletedComments;
        await this.commentRepository.save(parentComment);
      }
    }

    // 处理文章或消息表的评论数
    if (type === 1) {
      const article = await this.articleRepository.findOne({ where: { id: typeId } });
      if (article) {
        const user = await this.userRepository.findOne({ where: { name: article.userName } });
        if (user) {
          user.commentCount -= 1;
          await this.userRepository.save(user);
        }
        article.commentsCount -= totalDeletedComments;
        await this.articleRepository.save(article);
      }
    } else {
      const message = await this.messageRepository.findOne({ where: { id: typeId } });
      if (message) {
        const user = await this.userRepository.findOne({ where: { name: comment.commentUserName } });
        if (user) {
          user.commentCount -= 1;
          await this.userRepository.save(user);
        }
        message.commentsCount -= totalDeletedComments;
        await this.messageRepository.save(message);
      }
    }

    return comment; // 返回被删除的评论
  }

  /**
   * 递归查找所有子评论（包括嵌套的子评论）
   * @param parentId 父评论 ID
   * @returns 所有子评论的数组
   */
  async findAllChildComments(parentId: number): Promise<Comment[]> {
    const childComments = await this.commentRepository.find({ where: { parentId } });

    let allChildComments = [...childComments];

    // 递归查找嵌套的子评论
    for (const childComment of childComments) {
      const nestedChildComments = await this.findAllChildComments(childComment.id);
      allChildComments = allChildComments.concat(nestedChildComments);
    }

    return allChildComments;
  }

  // 搜索
  async searchComments(searchCommentDto: SearchCommentDto): Promise<Comment[]> {
    const { commentUserName, commentContent, type, isCheck } = searchCommentDto;
    if (!commentUserName && !commentContent && !type && isCheck === undefined) {
      return await this.commentRepository.find();
    }
    const where: FindOptionsWhere<Comment> = {};

    if (commentUserName) {
      where.commentUserName = Like(`%${commentUserName}%`);
    }
    if (commentContent) {
      where.commentContent = Like(`%${commentContent}%`);
    }
    if (type) {
      where.type = type;
    }
    if (isCheck !== undefined) {
      where.isCheck = isCheck;
    }
    return await this.commentRepository.find({ where });
  }

  // 获取评论数
  async getCommentCount(): Promise<number> {
    return await this.commentRepository.count();
  }

  // 获取文章或者留言的评论
  async getCommentCountByType(SearchCommentByTypeIdDto: SearchCommentByTypeIdDto): Promise<Comment[]> {
    const { type, typeId } = SearchCommentByTypeIdDto;
    // 文章
    if (type === 1) {
      const article = await this.articleRepository.findOne({ where: { id: typeId } });
      if (!article) {
        throw new NotFoundException('文章不存在');
      }
      return await this.commentRepository.find({ where: { type, typeId } });
    } else if (type === 2) {
      // 留言
      const message = await this.messageRepository.findOne({ where: { id: typeId } });
      if (!message) {
        throw new NotFoundException('留言不存在');
      }
      return await this.commentRepository.find({ where: { type, typeId } });
    }
    return [];
  }
}
