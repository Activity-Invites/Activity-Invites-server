import { Injectable } from '@nestjs/common';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ThemesSchemaClass } from '../entities/themes.schema';
import { ThemesRepository } from '../../themes.repository';
import { Themes } from '../../../../domain/themes';
import { themesMapper } from '../mappers/themes.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class ThemesDocumentRepository implements ThemesRepository {
  constructor(
    @InjectModel(ThemesSchemaClass.name)
    private readonly themesModel: Model<ThemesSchemaClass>,
  ) {}

  async create(data: Themes): Promise<Themes> {
    const persistenceModel = themesMapper.toPersistence(data);
    const createdEntity = new this.themesModel(persistenceModel);
    const entityObject = await createdEntity.save();
    return themesMapper.toDomain(entityObject);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
    }): Promise<Themes[]> {
    const entityObjects = await this.themesModel
      .find()
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit);

    return entityObjects.map((entityObject) =>
      themesMapper.toDomain(entityObject),
    );
  }

  async findById(id: Themes['id']): Promise<NullableType<Themes>> {
    const entityObject = await this.themesModel.findById(id);
    return entityObject ? themesMapper.toDomain(entityObject) : null;
  }

  async findByIds(ids: Themes['id'][]): Promise<Themes[]> {
    const entityObjects = await this.themesModel.find({ _id: { $in: ids } });
    return entityObjects.map((entityObject) =>
      themesMapper.toDomain(entityObject),
    );
  }

  async update(
    id: Themes['id'],
    payload: Partial<Themes>,
  ): Promise<NullableType<Themes>> {
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

  async remove(id: Themes['id']): Promise<void> {
    await this.themesModel.deleteOne({ _id: id });
  }
}
