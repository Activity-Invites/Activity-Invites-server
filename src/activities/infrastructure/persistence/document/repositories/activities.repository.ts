import { Injectable } from '@nestjs/common';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { activitiesSchemaClass } from '../entities/activities.schema';
import { activitiesRepository } from '../../activities.repository';
import { activities } from '../../../../domain/activities';
import { activitiesMapper } from '../mappers/activities.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class activitiesDocumentRepository implements activitiesRepository {
  constructor(
    @InjectModel(activitiesSchemaClass.name)
    private readonly activitiesModel: Model<activitiesSchemaClass>,
  ) {}

  async create(data: activities): Promise<activities> {
    const persistenceModel = activitiesMapper.toPersistence(data);
    const createdEntity = new this.activitiesModel(persistenceModel);
    const entityObject = await createdEntity.save();
    return activitiesMapper.toDomain(entityObject);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<activities[]> {
    const entityObjects = await this.activitiesModel
      .find()
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit);

    return entityObjects.map((entityObject) =>
      activitiesMapper.toDomain(entityObject),
    );
  }

  async findById(id: activities['id']): Promise<NullableType<activities>> {
    const entityObject = await this.activitiesModel.findById(id);
    return entityObject ? activitiesMapper.toDomain(entityObject) : null;
  }

  async findByIds(ids: activities['id'][]): Promise<activities[]> {
    const entityObjects = await this.activitiesModel.find({
      _id: { $in: ids },
    });
    return entityObjects.map((entityObject) =>
      activitiesMapper.toDomain(entityObject),
    );
  }

  async update(
    id: activities['id'],
    payload: Partial<activities>,
  ): Promise<NullableType<activities>> {
    const clonedPayload = { ...payload };
    delete clonedPayload.id;

    const filter = { _id: id.toString() };
    const entity = await this.activitiesModel.findOne(filter);

    if (!entity) {
      throw new Error('Record not found');
    }

    const entityObject = await this.activitiesModel.findOneAndUpdate(
      filter,
      activitiesMapper.toPersistence({
        ...activitiesMapper.toDomain(entity),
        ...clonedPayload,
      }),
      { new: true },
    );

    return entityObject ? activitiesMapper.toDomain(entityObject) : null;
  }

  async remove(id: activities['id']): Promise<void> {
    await this.activitiesModel.deleteOne({ _id: id });
  }
}
