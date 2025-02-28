import { Payment } from '../../../../domain/payment';
import { PaymentSchemaClass } from '../entities/payment.schema';

export class PaymentMapper {
  public static toDomain(raw: PaymentSchemaClass): Payment {
    const domainEntity = new Payment();
    domainEntity.id = raw._id.toString();
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  public static toPersistence(domainEntity: Payment): PaymentSchemaClass {
    const persistenceSchema = new PaymentSchemaClass();
    if (domainEntity.id) {
      persistenceSchema._id = domainEntity.id;
    }
    persistenceSchema.createdAt = domainEntity.createdAt;
    persistenceSchema.updatedAt = domainEntity.updatedAt;

    return persistenceSchema;
  }
}
