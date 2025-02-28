import { Themes } from '../../../../domain/themes';
import { ThemesSchemaClass } from '../entities/themes.schema';

export class themesMapper {
  public static toDomain(raw: ThemesSchemaClass): Themes {
    const domainEntity = new Themes();
    domainEntity.id = raw._id.toString();
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  public static toPersistence(domainEntity: Themes): ThemesSchemaClass {
    const persistenceSchema = new ThemesSchemaClass();
    if (domainEntity.id) {
      persistenceSchema._id = domainEntity.id;
    }
    persistenceSchema.createdAt = domainEntity.createdAt;
    persistenceSchema.updatedAt = domainEntity.updatedAt;

    return persistenceSchema;
  }
}
