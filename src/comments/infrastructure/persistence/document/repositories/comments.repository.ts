import { Injectable } from '@nestjs/common';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommentsSchemaClass } from '../entities/comments.schema';
import { CommentsRepository } from '../../comments.repository';
import { Comments } from '../../../../domain/comments';
import { CommentsMapper } from '../mappers/comments.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class CommentsDocumentRepository implements CommentsRepository {
  constructor(
    @InjectModel(CommentsSchemaClass.name)
    private readonly commentsModel: Model<CommentsSchemaClass>,
  ) {}

  async create(data: Comments): Promise<Comments> {
    const persistenceModel = CommentsMapper.toPersistence(data);
    const createdEntity = new this.commentsModel(persistenceModel);
    const entityObject = await createdEntity.save();
    return CommentsMapper.toDomain(entityObject);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
    }): Promise<Comments[]> {
    const entityObjects = await this.commentsModel
      .find()
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit);

    return entityObjects.map((entityObject) =>
      CommentsMapper.toDomain(entityObject),
    );
  }

  async findById(id: Comments['id']): Promise<NullableType<Comments>> {
    const entityObject = await this.commentsModel.findById(id);
    return entityObject ? CommentsMapper.toDomain(entityObject) : null;
  }

  async findByIds(ids: Comments['id'][]): Promise<Comments[]> {
    const entityObjects = await this.commentsModel.find({ _id: { $in: ids } });
    return entityObjects.map((entityObject) =>
      CommentsMapper.toDomain(entityObject),
    );
  }

  async update(
    id: Comments['id'],
    payload: Partial<Comments>,
  ): Promise<NullableType<Comments>> {
    const clonedPayload = { ...payload };
    delete clonedPayload.id;

    const filter = { _id: id.toString() };
    const entity = await this.commentsModel.findOne(filter);

    if (!entity) {
      throw new Error('Record not found');
    }

    const entityObject = await this.commentsModel.findOneAndUpdate(
      filter,
      CommentsMapper.toPersistence({
        ...CommentsMapper.toDomain(entity),
        ...clonedPayload,
      }),
      { new: true },
    );

    return entityObject ? CommentsMapper.toDomain(entityObject) : null;
  }

  async remove(id: Comments['id']): Promise<void> {
    await this.commentsModel.deleteOne({ _id: id });
  }
}
