import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommentSchemaClass } from '../entities/comment.schema';
import { Comment } from '@/comments/domain/comment';
import { CommentRepository } from '../../comment.repository';
import { CommentDocumentMapper } from '../mappers/comment.mapper';
import { NullableType } from '@/utils/types/nullable.type';
import { FilterCommentDto, SortCommentDto } from '@/comments/dto/query-comment.dto';
import { IPaginationOptions } from '@/utils/types/pagination-options';
import { DeepPartial } from '@/utils/types/deep-partial.type';

@Injectable()
export class CommentsDocumentRepository implements CommentRepository {
  constructor(
    @InjectModel(CommentSchemaClass.name)
    private readonly commentModel: Model<CommentSchemaClass>,
  ) {}

  async create(
    data: Omit<Comment, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'>,
  ): Promise<Comment> {
    const persistenceModel = CommentDocumentMapper.toDocument(data as Comment);
    const created = await this.commentModel.create(persistenceModel);
    return CommentDocumentMapper.toDomain(created);
  }

  async findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterCommentDto | null;
    sortOptions?: SortCommentDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Comment[]> {
    const query = this.commentModel.find();

    if (filterOptions?.activityId) {
      query.where('activity').equals(filterOptions.activityId);
    }

    if (filterOptions?.userId) {
      query.where('user').equals(filterOptions.userId);
    }

    if (sortOptions?.length) {
      // const sortCriteria = sortOptions.reduce(
      //   (acc, { orderBy, order }) => ({ ...acc, [orderBy]: order }),
      //   {},
      // );
      // query.sort(sortCriteria);
    }

    query
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit);

    const documents = await query.exec();
    return documents.map(doc => CommentDocumentMapper.toDomain(doc));
  }

  async findById(id: string): Promise<NullableType<Comment>> {
    const document = await this.commentModel.findById(id).exec();
    return document ? CommentDocumentMapper.toDomain(document) : null;
  }

  async findByIds(ids: string[]): Promise<Comment[]> {
    const documents = await this.commentModel.find({ _id: { $in: ids } }).exec();
    return documents.map(doc => CommentDocumentMapper.toDomain(doc));
  }

  async findByActivityId(activityId: string): Promise<Comment[]> {
    const documents = await this.commentModel
      .find({ activity: activityId })
      .exec();
    return documents.map(doc => CommentDocumentMapper.toDomain(doc));
  }

  async findByUserId(userId: string): Promise<Comment[]> {
    const documents = await this.commentModel
      .find({ user: userId })
      .exec();
    return documents.map(doc => CommentDocumentMapper.toDomain(doc));
  }

  async update(
    id: string,
    payload: DeepPartial<Comment>,
  ): Promise<Comment | null> {
    const persistenceModel = CommentDocumentMapper.toDocument(payload as Comment);
    const updated = await this.commentModel
      .findByIdAndUpdate(id, { $set: persistenceModel }, { new: true })
      .exec();
    return updated ? CommentDocumentMapper.toDomain(updated) : null;
  }

  async remove(id: string): Promise<void> {
    await this.commentModel.findByIdAndUpdate(id, {
      $set: { isDeleted: true, deletedAt: new Date() },
    });
  }
}
