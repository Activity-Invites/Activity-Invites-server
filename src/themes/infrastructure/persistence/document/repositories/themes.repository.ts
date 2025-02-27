import { Injectable } from '@nestjs/common';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { themesSchemaClass } from '../entities/themes.schema';
import { themesRepository } from '../../themes.repository';
import { themes } from '../../../../domain/themes';
import { themesMapper } from '../mappers/themes.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class themesDocumentRepository implements themesRepository {
  constructor(
    @InjectModel(themesSchemaClass.name)
    private readonly themesModel: Model<themesSchemaClass>,
  ) {}

  async create(data: themes): Promise<themes> {
    const persistenceModel = themesMapper.toPersistence(data);
    const createdEntity = new this.themesModel(persistenceModel);
    const entityObject = await createdEntity.save();
    return themesMapper.toDomain(entityObject);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<themes[]> {
    const entityObjects = await this.themesModel
      .find()
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit);

    return entityObjects.map((entityObject) =>
      themesMapper.toDomain(entityObject),
    );
  }

  async findById(id: themes['id']): Promise<NullableType<themes>> {
    const entityObject = await this.themesModel.findById(id);
    return entityObject ? themesMapper.toDomain(entityObject) : null;
  }

  async findByIds(ids: themes['id'][]): Promise<themes[]> {
    const entityObjects = await this.themesModel.find({ _id: { $in: ids } });
    return entityObjects.map((entityObject) =>
      themesMapper.toDomain(entityObject),
    );
  }

  async update(
    id: themes['id'],
    payload: Partial<themes>,
  ): Promise<NullableType<themes>> {
    const clonedPayload = { ...payload };
    delete clonedPayload.id;

    const filter = { _id: id.toString() };
    const entity = await this.themesModel.findOne(filter);

    if (!entity) {
      throw new Error('Record not found');
    }

    const entityObject = await this.themesModel.findOneAndUpdate(
      filter,
      themesMapper.toPersistence({
        ...themesMapper.toDomain(entity),
        ...clonedPayload,
      }),
      { new: true },
    );

    return entityObject ? themesMapper.toDomain(entityObject) : null;
  }

  async remove(id: themes['id']): Promise<void> {
    await this.themesModel.deleteOne({ _id: id });
  }
}
