import { Injectable, NotFoundException } from '@nestjs/common';
import { CommentRepository } from './infrastructure/persistence/comment.repository';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './domain/comment';
import { FilterCommentDto, SortCommentDto } from './dto/query-comment.dto';
import { IPaginationOptions } from '@/utils/types/pagination-options';

@Injectable()
export class CommentsService {
  constructor(private readonly commentRepository: CommentRepository) {}

  async create(createCommentDto: CreateCommentDto): Promise<Comment> {
    return this.commentRepository.create(createCommentDto);
  }

  async findAll(options: {
    filterOptions?: FilterCommentDto;
    sortOptions?: SortCommentDto[];
    paginationOptions: IPaginationOptions;
  }): Promise<Comment[]> {
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
    const updatedComment = await this.commentRepository.update(id, updateCommentDto);
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
