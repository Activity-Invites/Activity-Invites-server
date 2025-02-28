import { Injectable } from '@nestjs/common';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LocationSchemaClass } from '../entities/location.schema';
import { LocationRepository } from '../../location.repository';
import { Location } from '../../../../domain/location';
import { LocationMapper } from '../mappers/location.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class LocationDocumentRepository implements LocationRepository {
  constructor(
    @InjectModel(LocationSchemaClass.name)
    private readonly locationModel: Model<LocationSchemaClass>,
  ) {}

  async create(data: Location): Promise<Location> {
    const persistenceModel = LocationMapper.toPersistence(data);
    const createdEntity = new this.locationModel(persistenceModel);
    const entityObject = await createdEntity.save();
    return LocationMapper.toDomain(entityObject);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Location[]> {
    const entityObjects = await this.locationModel
      .find()
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit);

    return entityObjects.map((entityObject) =>
      LocationMapper.toDomain(entityObject),
    );
  }

  async findById(id: Location['id']): Promise<NullableType<Location>> {
    const entityObject = await this.locationModel.findById(id);
    return entityObject ? LocationMapper.toDomain(entityObject) : null;
  }

  async findByIds(ids: Location['id'][]): Promise<Location[]> {
    const entityObjects = await this.locationModel.find({ _id: { $in: ids } });
    return entityObjects.map((entityObject) =>
      LocationMapper.toDomain(entityObject),
    );
  }

  async update(
    id: Location['id'],
    payload: Partial<Location>,
  ): Promise<NullableType<Location>> {
    const clonedPayload = { ...payload };
    delete clonedPayload.id;

    const filter = { _id: id.toString() };
    const entity = await this.locationModel.findOne(filter);

    if (!entity) {
      throw new Error('Record not found');
    }

    const entityObject = await this.locationModel.findOneAndUpdate(
      filter,
      LocationMapper.toPersistence({
        ...LocationMapper.toDomain(entity),
        ...clonedPayload,
      }),
      { new: true },
    );

    return entityObject ? LocationMapper.toDomain(entityObject) : null;
  }

  async remove(id: Location['id']): Promise<void> {
    await this.locationModel.deleteOne({ _id: id });
  }
}
