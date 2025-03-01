import { Injectable } from '@nestjs/common';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QRCodeSchemaClass } from '../entities/q-r-code.schema';
import { QRCodeRepository } from '../../q-r-code.repository';
import { QRCode } from '../../../../domain/q-r-code';
import { QRCodeMapper } from '../mappers/q-r-code.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class QRCodeDocumentRepository implements QRCodeRepository {
  constructor(
    @InjectModel(QRCodeSchemaClass.name)
    private readonly qRCodeModel: Model<QRCodeSchemaClass>,
  ) {}

  async create(data: QRCode): Promise<QRCode> {
    const persistenceModel = QRCodeMapper.toPersistence(data);
    const createdEntity = new this.qRCodeModel(persistenceModel);
    const entityObject = await createdEntity.save();
    return QRCodeMapper.toDomain(entityObject);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<QRCode[]> {
    const entityObjects = await this.qRCodeModel
      .find()
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit);

    return entityObjects.map((entityObject) =>
      QRCodeMapper.toDomain(entityObject),
    );
  }

  async findById(id: QRCode['id']): Promise<NullableType<QRCode>> {
    const entityObject = await this.qRCodeModel.findById(id);
    return entityObject ? QRCodeMapper.toDomain(entityObject) : null;
  }

  async findByIds(ids: QRCode['id'][]): Promise<QRCode[]> {
    const entityObjects = await this.qRCodeModel.find({ _id: { $in: ids } });
    return entityObjects.map((entityObject) =>
      QRCodeMapper.toDomain(entityObject),
    );
  }

  async update(
    id: QRCode['id'],
    payload: Partial<QRCode>,
  ): Promise<NullableType<QRCode>> {
    const clonedPayload = { ...payload };
    delete clonedPayload.id;

    const filter = { _id: id.toString() };
    const entity = await this.qRCodeModel.findOne(filter);

    if (!entity) {
      throw new Error('Record not found');
    }

    const entityObject = await this.qRCodeModel.findOneAndUpdate(
      filter,
      QRCodeMapper.toPersistence({
        ...QRCodeMapper.toDomain(entity),
        ...clonedPayload,
      }),
      { new: true },
    );

    return entityObject ? QRCodeMapper.toDomain(entityObject) : null;
  }

  async remove(id: QRCode['id']): Promise<void> {
    await this.qRCodeModel.deleteOne({ _id: id });
  }
}
