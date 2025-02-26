import { Injectable, NotFoundException } from '@nestjs/common';
import { CommentRepository } from './infrastructure/persistence/comment.repository';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './domain/comment';
import { FilterCommentDto, SortCommentDto } from './dto/query-comment.dto';
import { IPaginationOptions } from '@/utils/types/pagination-options';
import { IPaginationResponse } from '@/utils/types/pagination-response';
import { Activity } from '@/activities/domain/activity';
import { User } from '@/users/domain/user';

@Injectable()
export class CommentsService {
  constructor(private readonly commentRepository: CommentRepository) {}

  async create(createCommentDto: CreateCommentDto): Promise<Comment> {
    const comment = new Comment();
    comment.content = createCommentDto.content;
    comment.activity = { id: createCommentDto.activityId } as Activity;
    comment.user = { id: createCommentDto.userId } as User;
    comment.isDeleted = false;
    comment.replies = [];

    if (createCommentDto.parentId) {
      comment.parent = { id: createCommentDto.parentId } as Comment;
    }

    return this.commentRepository.create(comment);
  }

  async findAll(options: {
    filterOptions?: FilterCommentDto;
    sortOptions?: SortCommentDto[];
    paginationOptions: IPaginationOptions;
  }): Promise<IPaginationResponse<Comment>> {
    return this.commentRepository.findManyWithPagination(options);
  }

  async findOne(id: string): Promise<Comment> {
    const comment = await this.commentRepository.findById(id);
    if (!comment) {
      throw new NotFoundException(`Comment with ID "${id}" not found`);
    }
    return comment;
  }

  async update(id: string, updateCommentDto: UpdateCommentDto): Promise<Comment> {
    const existingComment = await this.findOne(id);
    const updatedComment = await this.commentRepository.update(id, {
      ...existingComment,
      ...updateCommentDto,
    });
    if (!updatedComment) {
      throw new NotFoundException(`Comment with ID "${id}" not found`);
    }
    return updatedComment;
  }

  async remove(id: string): Promise<void> {
    const comment = await this.commentRepository.findById(id);
    if (!comment) {
      throw new NotFoundException(`Comment with ID "${id}" not found`);
    }
    await this.commentRepository.remove(id);
  }

  async findByActivityId(activityId: string): Promise<Comment[]> {
    return this.commentRepository.findByActivityId(activityId);
  }

  async findByUserId(userId: string): Promise<Comment[]> {
    return this.commentRepository.findByUserId(userId);
  }
}
