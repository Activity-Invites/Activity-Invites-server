import { Themes } from '../../../../domain/themes';
import { ThemesEntity } from '../entities/themes.entity';

export class themesMapper {
  static toDomain(raw: ThemesEntity): Themes {
    const domainEntity = new Themes();
    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Themes): ThemesEntity {
    const persistenceEntity = new ThemesEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
