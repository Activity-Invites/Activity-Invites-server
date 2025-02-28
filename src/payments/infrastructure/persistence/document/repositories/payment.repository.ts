import { Injectable } from '@nestjs/common';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaymentSchemaClass } from '../entities/payment.schema';
import { PaymentRepository } from '../../payment.repository';
import { Payment } from '../../../../domain/payment';
import { PaymentMapper } from '../mappers/payment.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class PaymentDocumentRepository implements PaymentRepository {
  constructor(
    @InjectModel(PaymentSchemaClass.name)
    private readonly paymentModel: Model<PaymentSchemaClass>,
  ) {}

  async create(data: Payment): Promise<Payment> {
    const persistenceModel = PaymentMapper.toPersistence(data);
    const createdEntity = new this.paymentModel(persistenceModel);
    const entityObject = await createdEntity.save();
    return PaymentMapper.toDomain(entityObject);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Payment[]> {
    const entityObjects = await this.paymentModel
      .find()
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit);

    return entityObjects.map((entityObject) =>
      PaymentMapper.toDomain(entityObject),
    );
  }

  async findById(id: Payment['id']): Promise<NullableType<Payment>> {
    const entityObject = await this.paymentModel.findById(id);
    return entityObject ? PaymentMapper.toDomain(entityObject) : null;
  }

  async findByIds(ids: Payment['id'][]): Promise<Payment[]> {
    const entityObjects = await this.paymentModel.find({ _id: { $in: ids } });
    return entityObjects.map((entityObject) =>
      PaymentMapper.toDomain(entityObject),
    );
  }

  async update(
    id: Payment['id'],
    payload: Partial<Payment>,
  ): Promise<NullableType<Payment>> {
    const clonedPayload = { ...payload };
    delete clonedPayload.id;

    const filter = { _id: id.toString() };
    const entity = await this.paymentModel.findOne(filter);

    if (!entity) {
      throw new Error('Record not found');
    }

    const entityObject = await this.paymentModel.findOneAndUpdate(
      filter,
      PaymentMapper.toPersistence({
        ...PaymentMapper.toDomain(entity),
        ...clonedPayload,
      }),
      { new: true },
    );

    return entityObject ? PaymentMapper.toDomain(entityObject) : null;
  }

  async remove(id: Payment['id']): Promise<void> {
    await this.paymentModel.deleteOne({ _id: id });
  }
}
