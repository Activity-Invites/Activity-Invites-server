import { SocialCard } from '../../../../domain/social-card';
import { SocialCardEntity } from '../entities/social-card.entity';

export class SocialCardMapper {
  static toDomain(raw: SocialCardEntity): SocialCard {
    const domainEntity = new SocialCard();
    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: SocialCard): SocialCardEntity {
    const persistenceEntity = new SocialCardEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
