import { Injectable } from '@nestjs/common';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ticketsSchemaClass } from '../entities/tickets.schema';
import { ticketsRepository } from '../../tickets.repository';
import { tickets } from '../../../../domain/tickets';
import { ticketsMapper } from '../mappers/tickets.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class ticketsDocumentRepository implements ticketsRepository {
  constructor(
    @InjectModel(ticketsSchemaClass.name)
    private readonly ticketsModel: Model<ticketsSchemaClass>,
  ) {}

  async create(data: tickets): Promise<tickets> {
    const persistenceModel = ticketsMapper.toPersistence(data);
    const createdEntity = new this.ticketsModel(persistenceModel);
    const entityObject = await createdEntity.save();
    return ticketsMapper.toDomain(entityObject);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<tickets[]> {
    const entityObjects = await this.ticketsModel
      .find()
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit);

    return entityObjects.map((entityObject) =>
      ticketsMapper.toDomain(entityObject),
    );
  }

  async findById(id: tickets['id']): Promise<NullableType<tickets>> {
    const entityObject = await this.ticketsModel.findById(id);
    return entityObject ? ticketsMapper.toDomain(entityObject) : null;
  }

  async findByIds(ids: tickets['id'][]): Promise<tickets[]> {
    const entityObjects = await this.ticketsModel.find({ _id: { $in: ids } });
    return entityObjects.map((entityObject) =>
      ticketsMapper.toDomain(entityObject),
    );
  }

  async update(
    id: tickets['id'],
    payload: Partial<tickets>,
  ): Promise<NullableType<tickets>> {
    const clonedPayload = { ...payload };
    delete clonedPayload.id;

    const filter = { _id: id.toString() };
    const entity = await this.ticketsModel.findOne(filter);

    if (!entity) {
      throw new Error('Record not found');
    }

    const entityObject = await this.ticketsModel.findOneAndUpdate(
      filter,
      ticketsMapper.toPersistence({
        ...ticketsMapper.toDomain(entity),
        ...clonedPayload,
      }),
      { new: true },
    );

    return entityObject ? ticketsMapper.toDomain(entityObject) : null;
  }

  async remove(id: tickets['id']): Promise<void> {
    await this.ticketsModel.deleteOne({ _id: id });
  }
}
