import { themes } from '../../../../domain/themes';
import { themesSchemaClass } from '../entities/themes.schema';

export class themesMapper {
  public static toDomain(raw: themesSchemaClass): themes {
    const domainEntity = new themes();
    domainEntity.id = raw._id.toString();
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  public static toPersistence(domainEntity: themes): themesSchemaClass {
    const persistenceSchema = new themesSchemaClass();
    if (domainEntity.id) {
      persistenceSchema._id = domainEntity.id;
    }
    persistenceSchema.createdAt = domainEntity.createdAt;
    persistenceSchema.updatedAt = domainEntity.updatedAt;

    return persistenceSchema;
  }
}
