import { activities } from '../../../../domain/activities';
import { themesMapper } from '../../../../../themes/infrastructure/persistence/relational/mappers/themes.mapper';

import { activitiesEntity } from '../entities/activities.entity';

export class activitiesMapper {
  static toDomain(raw: activitiesEntity): activities {
    const domainEntity = new activities();
    if (raw.themeId) {
      domainEntity.themeId = themesMapper.toDomain(raw.themeId);
    }

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: activities): activitiesEntity {
    const persistenceEntity = new activitiesEntity();
    if (domainEntity.themeId) {
      persistenceEntity.themeId = themesMapper.toPersistence(
        domainEntity.themeId,
      );
    }

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
