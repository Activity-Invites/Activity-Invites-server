import { Injectable } from '@nestjs/common';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TagsSchemaClass } from '../entities/tags.schema';
import { TagsRepository } from '../../tags.repository';
import { Tags } from '../../../../domain/tags';
import { TagsMapper } from '../mappers/tags.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class TagsDocumentRepository implements TagsRepository {
  constructor(
    @InjectModel(TagsSchemaClass.name)
    private readonly tagsModel: Model<TagsSchemaClass>,
  ) {}

  async create(data: Tags): Promise<Tags> {
    const persistenceModel = TagsMapper.toPersistence(data);
    const createdEntity = new this.tagsModel(persistenceModel);
    const entityObject = await createdEntity.save();
    return TagsMapper.toDomain(entityObject);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Tags[]> {
    const entityObjects = await this.tagsModel
      .find()
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit);

    return entityObjects.map((entityObject) =>
      TagsMapper.toDomain(entityObject),
    );
  }

  async findById(id: Tags['id']): Promise<NullableType<Tags>> {
    const entityObject = await this.tagsModel.findById(id);
    return entityObject ? TagsMapper.toDomain(entityObject) : null;
  }

  async findByIds(ids: Tags['id'][]): Promise<Tags[]> {
    const entityObjects = await this.tagsModel.find({ _id: { $in: ids } });
    return entityObjects.map((entityObject) =>
      TagsMapper.toDomain(entityObject),
    );
  }

  async update(
    id: Tags['id'],
    payload: Partial<Tags>,
  ): Promise<NullableType<Tags>> {
    const clonedPayload = { ...payload };
    delete clonedPayload.id;

    const filter = { _id: id.toString() };
    const entity = await this.tagsModel.findOne(filter);

    if (!entity) {
      throw new Error('Record not found');
    }

    const entityObject = await this.tagsModel.findOneAndUpdate(
      filter,
      TagsMapper.toPersistence({
        ...TagsMapper.toDomain(entity),
        ...clonedPayload,
      }),
      { new: true },
    );

    return entityObject ? TagsMapper.toDomain(entityObject) : null;
  }

  async remove(id: Tags['id']): Promise<void> {
    await this.tagsModel.deleteOne({ _id: id });
  }
}
