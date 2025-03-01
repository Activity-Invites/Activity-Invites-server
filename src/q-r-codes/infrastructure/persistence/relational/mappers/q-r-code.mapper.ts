import { QRCode } from '../../../../domain/q-r-code';
import { QRCodeEntity } from '../entities/q-r-code.entity';

export class QRCodeMapper {
  static toDomain(raw: QRCodeEntity): QRCode {
    const domainEntity = new QRCode();
    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: QRCode): QRCodeEntity {
    const persistenceEntity = new QRCodeEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
