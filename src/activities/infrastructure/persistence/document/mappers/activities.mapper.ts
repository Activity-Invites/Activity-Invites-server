import { activities } from '../../../../domain/activities';
import { themesMapper } from '../../../../../themes/infrastructure/persistence/document/mappers/themes.mapper';

import { activitiesSchemaClass } from '../entities/activities.schema';

export class activitiesMapper {
  public static toDomain(raw: activitiesSchemaClass): activities {
    const domainEntity = new activities();
    if (raw.themeId) {
      domainEntity.themeId = themesMapper.toDomain(raw.themeId);
    }

    domainEntity.id = raw._id.toString();
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  public static toPersistence(domainEntity: activities): activitiesSchemaClass {
    const persistenceSchema = new activitiesSchemaClass();
    if (domainEntity.themeId) {
      persistenceSchema.themeId = themesMapper.toPersistence(
        domainEntity.themeId,
      );
    }

    if (domainEntity.id) {
      persistenceSchema._id = domainEntity.id;
    }
    persistenceSchema.createdAt = domainEntity.createdAt;
    persistenceSchema.updatedAt = domainEntity.updatedAt;

    return persistenceSchema;
  }
}
