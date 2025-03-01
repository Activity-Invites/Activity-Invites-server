import { Injectable } from '@nestjs/common';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SocialCardSchemaClass } from '../entities/social-card.schema';
import { SocialCardRepository } from '../../social-card.repository';
import { SocialCard } from '../../../../domain/social-card';
import { SocialCardMapper } from '../mappers/social-card.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class SocialCardDocumentRepository implements SocialCardRepository {
  constructor(
    @InjectModel(SocialCardSchemaClass.name)
    private readonly socialCardModel: Model<SocialCardSchemaClass>,
  ) {}

  async create(data: SocialCard): Promise<SocialCard> {
    const persistenceModel = SocialCardMapper.toPersistence(data);
    const createdEntity = new this.socialCardModel(persistenceModel);
    const entityObject = await createdEntity.save();
    return SocialCardMapper.toDomain(entityObject);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<SocialCard[]> {
    const entityObjects = await this.socialCardModel
      .find()
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit);

    return entityObjects.map((entityObject) =>
      SocialCardMapper.toDomain(entityObject),
    );
  }

  async findById(id: SocialCard['id']): Promise<NullableType<SocialCard>> {
    const entityObject = await this.socialCardModel.findById(id);
    return entityObject ? SocialCardMapper.toDomain(entityObject) : null;
  }

  async findByIds(ids: SocialCard['id'][]): Promise<SocialCard[]> {
    const entityObjects = await this.socialCardModel.find({ _id: { $in: ids } });
    return entityObjects.map((entityObject) =>
      SocialCardMapper.toDomain(entityObject),
    );
  }

  async update(
    id: SocialCard['id'],
    payload: Partial<SocialCard>,
  ): Promise<NullableType<SocialCard>> {
    const clonedPayload = { ...payload };
    delete clonedPayload.id;

    const filter = { _id: id.toString() };
    const entity = await this.socialCardModel.findOne(filter);

    if (!entity) {
      throw new Error('Record not found');
    }

    const entityObject = await this.socialCardModel.findOneAndUpdate(
      filter,
      SocialCardMapper.toPersistence({
        ...SocialCardMapper.toDomain(entity),
        ...clonedPayload,
      }),
      { new: true },
    );

    return entityObject ? SocialCardMapper.toDomain(entityObject) : null;
  }

  async remove(id: SocialCard['id']): Promise<void> {
    await this.socialCardModel.deleteOne({ _id: id });
  }
}
