import { QRCode } from '../../../../domain/q-r-code';
import { QRCodeSchemaClass } from '../entities/q-r-code.schema';

export class QRCodeMapper {
  public static toDomain(raw: QRCodeSchemaClass): QRCode {
    const domainEntity = new QRCode();
    domainEntity.id = raw._id.toString();
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  public static toPersistence(domainEntity: QRCode): QRCodeSchemaClass {
    const persistenceSchema = new QRCodeSchemaClass();
    if (domainEntity.id) {
      persistenceSchema._id = domainEntity.id;
    }
    persistenceSchema.createdAt = domainEntity.createdAt;
    persistenceSchema.updatedAt = domainEntity.updatedAt;

    return persistenceSchema;
  }
}
