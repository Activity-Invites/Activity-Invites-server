import { Activities } from '../../../../domain/activities';




import { themesMapper } from '../../../../../themes/infrastructure/persistence/relational/mappers/themes.mapper';

import { ActivitiesEntity } from '../entities/activities.entity';

export class activitiesMapper {
  static toDomain(raw: ActivitiesEntity): Activities {
    const domainEntity = new Activities();
  domainEntity.endTime = raw.endTime;




  domainEntity.startTime = raw.startTime;




  domainEntity.mainImage = raw.mainImage;




  domainEntity.name = raw.name;




    if (raw.themeId) {
      domainEntity.themeId = themesMapper.toDomain(raw.themeId);
    }

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Activities): ActivitiesEntity {
    const persistenceEntity = new ActivitiesEntity();
  persistenceEntity.endTime = domainEntity.endTime;




  persistenceEntity.startTime = domainEntity.startTime;




  persistenceEntity.mainImage = domainEntity.mainImage;




  persistenceEntity.name = domainEntity.name;




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
