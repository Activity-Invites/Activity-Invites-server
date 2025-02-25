import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IPaginationOptions } from '@/utils/types/pagination-options';
import { IPaginationResponse } from '@/utils/types/pagination-response';
import { NullableType } from '@/utils/types/nullable.type';
import { DeepPartial } from '@/utils/types/deep-partial.type';
import { Comment } from '@/comments/domain/comment';
import { FilterCommentDto, SortCommentDto } from '@/comments/dto/query-comment.dto';
import { CommentRepository } from '../../comment.repository';
import { CommentEntity } from '../entities/comment.entity';
import { CommentMapper } from '../mappers/comment.mapper';

@Injectable()
export class CommentsRelationalRepository implements CommentRepository {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentsRepository: Repository<CommentEntity>,
  ) {}

  async create(
    data: Omit<Comment, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'>,
  ): Promise<Comment> {
    const persistenceModel = CommentMapper.toPersistence(data as Comment);
    const savedComment = await this.commentsRepository.save(persistenceModel);
    return CommentMapper.toDomain(savedComment);
  }

  async findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterCommentDto | null;
    sortOptions?: SortCommentDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<IPaginationResponse<Comment>> {
    const queryBuilder = this.commentsRepository.createQueryBuilder('comment')
      .leftJoinAndSelect('comment.activity', 'activity')
      .leftJoinAndSelect('comment.user', 'user')
      .leftJoinAndSelect('comment.parent', 'parent')
      .leftJoinAndSelect('comment.replies', 'replies');

    if (filterOptions?.activityId) {
      queryBuilder.andWhere('activity.id = :activityId', {
        activityId: filterOptions.activityId,
      });
    }

    if (filterOptions?.userId) {
      queryBuilder.andWhere('user.id = :userId', {
        userId: filterOptions.userId,
      });
    }

    if (filterOptions?.parentId) {
      queryBuilder.andWhere('parent.id = :parentId', {
        parentId: filterOptions.parentId,
      });
    }

    if (sortOptions?.length) {
      sortOptions.forEach((sort) => {
        queryBuilder.addOrderBy(`comment.${sort.field}`, sort.order);
      });
    } else {
      // Default sorting by creation date
      queryBuilder.orderBy('comment.createdAt', 'DESC');
    }

    const [items, total] = await queryBuilder
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .take(paginationOptions.limit)
      .getManyAndCount();

    return {
      items: items.map((comment) => CommentMapper.toDomain(comment)),
      total,
    };
  }

  async findById(id: Comment['id']): Promise<NullableType<Comment>> {
    const queryBuilder = this.commentsRepository.createQueryBuilder('comment')
      .leftJoinAndSelect('comment.activity', 'activity')
      .leftJoinAndSelect('comment.user', 'user')
      .leftJoinAndSelect('comment.parent', 'parent')
      .leftJoinAndSelect('comment.replies', 'replies')
      .where('comment.id = :id', { id });

    const comment = await queryBuilder.getOne();
    return comment ? CommentMapper.toDomain(comment) : null;
  }

  async findByIds(ids: Comment['id'][]): Promise<Comment[]> {
    const queryBuilder = this.commentsRepository.createQueryBuilder('comment')
      .leftJoinAndSelect('comment.activity', 'activity')
      .leftJoinAndSelect('comment.user', 'user')
      .leftJoinAndSelect('comment.parent', 'parent')
      .leftJoinAndSelect('comment.replies', 'replies')
      .where('comment.id IN (:...ids)', { ids });

    const comments = await queryBuilder.getMany();
    return comments.map((comment) => CommentMapper.toDomain(comment));
  }

  async findByActivityId(activityId: string): Promise<Comment[]> {
    const queryBuilder = this.commentsRepository.createQueryBuilder('comment')
      .leftJoinAndSelect('comment.activity', 'activity')
      .leftJoinAndSelect('comment.user', 'user')
      .leftJoinAndSelect('comment.parent', 'parent')
      .leftJoinAndSelect('comment.replies', 'replies')
      .where('activity.id = :activityId', { activityId })
      .orderBy('comment.createdAt', 'DESC');

    const comments = await queryBuilder.getMany();
    return comments.map((comment) => CommentMapper.toDomain(comment));
  }

  async findByUserId(userId: string): Promise<Comment[]> {
    const queryBuilder = this.commentsRepository.createQueryBuilder('comment')
      .leftJoinAndSelect('comment.activity', 'activity')
      .leftJoinAndSelect('comment.user', 'user')
      .leftJoinAndSelect('comment.parent', 'parent')
      .leftJoinAndSelect('comment.replies', 'replies')
      .where('user.id = :userId', { userId })
      .orderBy('comment.createdAt', 'DESC');

    const comments = await queryBuilder.getMany();
    return comments.map((comment) => CommentMapper.toDomain(comment));
  }

  async update(
    id: Comment['id'],
    payload: DeepPartial<Comment>,
  ): Promise<Comment | null> {
    const persistenceModel = CommentMapper.toPersistence(payload as Comment);
    await this.commentsRepository.update(id, persistenceModel);
    return this.findById(id);
  }

  async remove(id: Comment['id']): Promise<void> {
    await this.commentsRepository.delete(id);
  }

  async softRemove(id: Comment['id']): Promise<void> {
    await this.commentsRepository.softDelete(id);
  }

  async restore(id: Comment['id']): Promise<void> {
    await this.commentsRepository.restore(id);
  }

  async findRepliesByCommentId(commentId: string): Promise<Comment[]> {
    const queryBuilder = this.commentsRepository.createQueryBuilder('comment')
      .leftJoinAndSelect('comment.activity', 'activity')
      .leftJoinAndSelect('comment.user', 'user')
      .leftJoinAndSelect('comment.parent', 'parent')
      .where('parent.id = :commentId', { commentId })
      .orderBy('comment.createdAt', 'ASC');

    const comments = await queryBuilder.getMany();
    return comments.map((comment) => CommentMapper.toDomain(comment));
  }

  async countByActivityId(activityId: string): Promise<number> {
    return this.commentsRepository.createQueryBuilder('comment')
      .leftJoin('comment.activity', 'activity')
      .where('activity.id = :activityId', { activityId })
      .getCount();
  }
}