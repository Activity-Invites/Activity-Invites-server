import { Injectable } from '@nestjs/common';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { commentsSchemaClass } from '../entities/comments.schema';
import { commentsRepository } from '../../comments.repository';
import { comments } from '../../../../domain/comments';
import { commentsMapper } from '../mappers/comments.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class commentsDocumentRepository implements commentsRepository {
  constructor(
    @InjectModel(commentsSchemaClass.name)
    private readonly commentsModel: Model<commentsSchemaClass>,
  ) {}

  async create(data: comments): Promise<comments> {
    const persistenceModel = commentsMapper.toPersistence(data);
    const createdEntity = new this.commentsModel(persistenceModel);
    const entityObject = await createdEntity.save();
    return commentsMapper.toDomain(entityObject);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<comments[]> {
    const entityObjects = await this.commentsModel
      .find()
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit);

    return entityObjects.map((entityObject) =>
      commentsMapper.toDomain(entityObject),
    );
  }

  async findById(id: comments['id']): Promise<NullableType<comments>> {
    const entityObject = await this.commentsModel.findById(id);
    return entityObject ? commentsMapper.toDomain(entityObject) : null;
  }

  async findByIds(ids: comments['id'][]): Promise<comments[]> {
    const entityObjects = await this.commentsModel.find({ _id: { $in: ids } });
    return entityObjects.map((entityObject) =>
      commentsMapper.toDomain(entityObject),
    );
  }

  async update(
    id: comments['id'],
    payload: Partial<comments>,
  ): Promise<NullableType<comments>> {
    const clonedPayload = { ...payload };
    delete clonedPayload.id;

    const filter = { _id: id.toString() };
    const entity = await this.commentsModel.findOne(filter);

    if (!entity) {
      throw new Error('Record not found');
    }

    const entityObject = await this.commentsModel.findOneAndUpdate(
      filter,
      commentsMapper.toPersistence({
        ...commentsMapper.toDomain(entity),
        ...clonedPayload,
      }),
      { new: true },
    );

    return entityObject ? commentsMapper.toDomain(entityObject) : null;
  }

  async remove(id: comments['id']): Promise<void> {
    await this.commentsModel.deleteOne({ _id: id });
  }
}
