import { Theme } from '@/themes/domain/theme';
import { ThemeEntity } from '../entities/theme.entity';
import { ActivityMapper } from '@/activities/infrastructure/persistence/relational/mappers/activity.mapper';

export class ThemeMapper {
  static toDomain(raw: ThemeEntity): Theme {
    const domainEntity = new Theme();
    domainEntity.id = raw.id;
    domainEntity.name = raw.name;
    domainEntity.description = raw.description;
    domainEntity.category = raw.category;
    domainEntity.tags = raw.tags;
    domainEntity.coverImage = raw.coverImage;
    domainEntity.isDeleted = raw.isDeleted;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;
    domainEntity.deletedAt = raw.deletedAt;

    if (raw.activities) {
      domainEntity.activities = raw.activities.map(activity => 
        ActivityMapper.toDomain(activity)
      );
    }

    return domainEntity;
  }

  static toPersistence(domain: Theme): ThemeEntity {
    const persistenceEntity = new ThemeEntity();
    
    if (domain.id) {
      persistenceEntity.id = domain.id;
    }

    persistenceEntity.name = domain.name;
    persistenceEntity.description = domain.description;
    persistenceEntity.category = domain.category;
    persistenceEntity.tags = domain.tags;
    persistenceEntity.coverImage = domain.coverImage;
    persistenceEntity.isDeleted = domain.isDeleted;

    return persistenceEntity;
  }
}
