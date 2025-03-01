import { Templates } from '../../../../domain/templates';
import { TemplatesEntity } from '../entities/templates.entity';

export class TemplatesMapper {
  static toDomain(raw: TemplatesEntity): Templates {
    const domainEntity = new Templates();
    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Templates): TemplatesEntity {
    const persistenceEntity = new TemplatesEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
