import { SocialCard } from '../../../../domain/social-card';
import { SocialCardSchemaClass } from '../entities/social-card.schema';

export class SocialCardMapper {
  public static toDomain(raw: SocialCardSchemaClass): SocialCard {
    const domainEntity = new SocialCard();
    domainEntity.id = raw._id.toString();
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  public static toPersistence(domainEntity: SocialCard): SocialCardSchemaClass {
    const persistenceSchema = new SocialCardSchemaClass();
    if (domainEntity.id) {
      persistenceSchema._id = domainEntity.id;
    }
    persistenceSchema.createdAt = domainEntity.createdAt;
    persistenceSchema.updatedAt = domainEntity.updatedAt;

    return persistenceSchema;
  }
}
