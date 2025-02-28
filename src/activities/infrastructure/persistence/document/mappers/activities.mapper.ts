import { Activities } from '../../../../domain/activities';




import { themesMapper } from '../../../../../themes/infrastructure/persistence/document/mappers/themes.mapper';

import { ActivitiesSchemaClass } from '../entities/activities.schema';

export class ActivitiesMapper {
  public static toDomain(raw: ActivitiesSchemaClass): Activities {
    const domainEntity = new Activities();
  domainEntity.endTime = raw.endTime;

  domainEntity.startTime = raw.startTime;

  domainEntity.mainImage = raw.mainImage;

  domainEntity.name = raw.name;

    if (raw.themeId) {
      domainEntity.themeId = themesMapper.toDomain(raw.themeId);
    }

    domainEntity.id = raw._id.toString();
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  public static toPersistence(domainEntity: Activities): ActivitiesSchemaClass {
    const persistenceSchema = new ActivitiesSchemaClass();
  persistenceSchema.endTime = domainEntity.endTime;

  persistenceSchema.startTime = domainEntity.startTime;

  persistenceSchema.mainImage = domainEntity.mainImage;

  persistenceSchema.name = domainEntity.name;

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
