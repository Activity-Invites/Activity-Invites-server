import { Injectable } from '@nestjs/common';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TemplatesSchemaClass } from '../entities/templates.schema';
import { TemplatesRepository } from '../../templates.repository';
import { Templates } from '../../../../domain/templates';
import { TemplatesMapper } from '../mappers/templates.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class TemplatesDocumentRepository implements TemplatesRepository {
  constructor(
    @InjectModel(TemplatesSchemaClass.name)
    private readonly templatesModel: Model<TemplatesSchemaClass>,
  ) {}

  async create(data: Templates): Promise<Templates> {
    const persistenceModel = TemplatesMapper.toPersistence(data);
    const createdEntity = new this.templatesModel(persistenceModel);
    const entityObject = await createdEntity.save();
    return TemplatesMapper.toDomain(entityObject);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Templates[]> {
    const entityObjects = await this.templatesModel
      .find()
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit);

    return entityObjects.map((entityObject) =>
      TemplatesMapper.toDomain(entityObject),
    );
  }

  async findById(id: Templates['id']): Promise<NullableType<Templates>> {
    const entityObject = await this.templatesModel.findById(id);
    return entityObject ? TemplatesMapper.toDomain(entityObject) : null;
  }

  async findByIds(ids: Templates['id'][]): Promise<Templates[]> {
    const entityObjects = await this.templatesModel.find({ _id: { $in: ids } });
    return entityObjects.map((entityObject) =>
      TemplatesMapper.toDomain(entityObject),
    );
  }

  async update(
    id: Templates['id'],
    payload: Partial<Templates>,
  ): Promise<NullableType<Templates>> {
    const clonedPayload = { ...payload };
    delete clonedPayload.id;

    const filter = { _id: id.toString() };
    const entity = await this.templatesModel.findOne(filter);

    if (!entity) {
      throw new Error('Record not found');
    }

    const entityObject = await this.templatesModel.findOneAndUpdate(
      filter,
      TemplatesMapper.toPersistence({
        ...TemplatesMapper.toDomain(entity),
        ...clonedPayload,
      }),
      { new: true },
    );

    return entityObject ? TemplatesMapper.toDomain(entityObject) : null;
  }

  async remove(id: Templates['id']): Promise<void> {
    await this.templatesModel.deleteOne({ _id: id });
  }
}
