import { Tags } from '../../../../domain/tags';
import { TagsSchemaClass } from '../entities/tags.schema';

export class TagsMapper {
  public static toDomain(raw: TagsSchemaClass): Tags {
    const domainEntity = new Tags();
    domainEntity.id = raw._id.toString();
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  public static toPersistence(domainEntity: Tags): TagsSchemaClass {
    const persistenceSchema = new TagsSchemaClass();
    if (domainEntity.id) {
      persistenceSchema._id = domainEntity.id;
    }
    persistenceSchema.createdAt = domainEntity.createdAt;
    persistenceSchema.updatedAt = domainEntity.updatedAt;

    return persistenceSchema;
  }
}
