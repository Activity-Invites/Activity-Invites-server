import { Injectable } from '@nestjs/common';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TicketsSchemaClass } from '../entities/tickets.schema';
import { TicketsRepository } from '../../tickets.repository';
import { Tickets } from '../../../../domain/tickets';
import { TicketsMapper } from '../mappers/tickets.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class TicketsDocumentRepository implements TicketsRepository {
  constructor(
    @InjectModel(TicketsSchemaClass.name)
    private readonly ticketsModel: Model<TicketsSchemaClass>,
  ) {}

  async create(data: Tickets): Promise<Tickets> {
    const persistenceModel = TicketsMapper.toPersistence(data);
    const createdEntity = new this.ticketsModel(persistenceModel);
    const entityObject = await createdEntity.save();
    return TicketsMapper.toDomain(entityObject);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Tickets[]> {
    const entityObjects = await this.ticketsModel
      .find()
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit);

    return entityObjects.map((entityObject) =>
      TicketsMapper.toDomain(entityObject),
    );
  }

  async findById(id: Tickets['id']): Promise<NullableType<Tickets>> {
    const entityObject = await this.ticketsModel.findById(id);
    return entityObject ? TicketsMapper.toDomain(entityObject) : null;
  }

  async findByIds(ids: Tickets['id'][]): Promise<Tickets[]> {
    const entityObjects = await this.ticketsModel.find({ _id: { $in: ids } });
    return entityObjects.map((entityObject) =>
      TicketsMapper.toDomain(entityObject),
    );
  }

  async update(
    id: Tickets['id'],
    payload: Partial<Tickets>,
  ): Promise<NullableType<Tickets>> {
    const clonedPayload = { ...payload };
    delete clonedPayload.id;

    const filter = { _id: id.toString() };
    const entity = await this.ticketsModel.findOne(filter);

    if (!entity) {
      throw new Error('Record not found');
    }

    const entityObject = await this.ticketsModel.findOneAndUpdate(
      filter,
      TicketsMapper.toPersistence({
        ...TicketsMapper.toDomain(entity),
        ...clonedPayload,
      }),
      { new: true },
    );

    return entityObject ? TicketsMapper.toDomain(entityObject) : null;
  }

  async remove(id: Tickets['id']): Promise<void> {
    await this.ticketsModel.deleteOne({ _id: id });
  }
}
