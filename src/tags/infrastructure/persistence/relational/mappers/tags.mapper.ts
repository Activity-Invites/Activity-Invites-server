import { Tags } from '../../../../domain/tags';
import { TagsEntity } from '../entities/tags.entity';

export class TagsMapper {
  static toDomain(raw: TagsEntity): Tags {
    const domainEntity = new Tags();
    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Tags): TagsEntity {
    const persistenceEntity = new TagsEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
