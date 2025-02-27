import { themes } from '../../../../domain/themes';
import { themesEntity } from '../entities/themes.entity';

export class themesMapper {
  static toDomain(raw: themesEntity): themes {
    const domainEntity = new themes();
    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: themes): themesEntity {
    const persistenceEntity = new themesEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
