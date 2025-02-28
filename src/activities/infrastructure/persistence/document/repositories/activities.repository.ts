import { Injectable } from '@nestjs/common';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ActivitiesSchemaClass } from '../entities/activities.schema';
import { ActivitiesRepository } from '../../activities.repository';
import { Activities } from '@/activities/domain/activities';
import { ActivitiesMapper } from '../mappers/activities.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class ActivitiesDocumentRepository implements ActivitiesRepository {
  constructor(
    @InjectModel(ActivitiesSchemaClass.name)
    private readonly activitiesModel: Model<ActivitiesSchemaClass>,
  ) {}

  async create(data: Activities): Promise<Activities> {
    const persistenceModel = ActivitiesMapper.toPersistence(data);
    const createdEntity = new this.activitiesModel(persistenceModel);
    const entityObject = await createdEntity.save();
    return ActivitiesMapper.toDomain(entityObject);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
    }): Promise<Activities[]> {
    const entityObjects = await this.activitiesModel
      .find()
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit);

    return entityObjects.map((entityObject) =>
      ActivitiesMapper.toDomain(entityObject),
    );
  }

  async findById(id: Activities['id']): Promise<NullableType<Activities>> {
    const entityObject = await this.activitiesModel.findById(id);
    return entityObject ? ActivitiesMapper.toDomain(entityObject) : null;
  }

  async findByIds(ids: Activities['id'][]): Promise<Activities[]> {
    const entityObjects = await this.activitiesModel.find({
      _id: { $in: ids },
    });
    return entityObjects.map((entityObject) =>
      ActivitiesMapper.toDomain(entityObject),
    );
  }

  async update(
    id: Activities['id'],
    payload: Partial<Activities>,
  ): Promise<NullableType<Activities>> {
    const clonedPayload = { ...payload };
    delete clonedPayload.id;

    const filter = { _id: id.toString() };
    const entity = await this.activitiesModel.findOne(filter);

    if (!entity) {
      throw new Error('Record not found');
    }

    const entityObject = await this.activitiesModel.findOneAndUpdate(
      filter,
      ActivitiesMapper.toPersistence({
        ...ActivitiesMapper.toDomain(entity),
        ...clonedPayload,
      }),
      { new: true },
    );

    return entityObject ? ActivitiesMapper.toDomain(entityObject) : null;
  }

  async remove(id: Activities['id']): Promise<void> {
    await this.activitiesModel.deleteOne({ _id: id });
  }
}
