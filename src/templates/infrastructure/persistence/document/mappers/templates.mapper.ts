import { Templates } from '../../../../domain/templates';
import { TemplatesSchemaClass } from '../entities/templates.schema';

export class TemplatesMapper {
  public static toDomain(raw: TemplatesSchemaClass): Templates {
    const domainEntity = new Templates();
    domainEntity.id = raw._id.toString();
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  public static toPersistence(domainEntity: Templates): TemplatesSchemaClass {
    const persistenceSchema = new TemplatesSchemaClass();
    if (domainEntity.id) {
      persistenceSchema._id = domainEntity.id;
    }
    persistenceSchema.createdAt = domainEntity.createdAt;
    persistenceSchema.updatedAt = domainEntity.updatedAt;

    return persistenceSchema;
  }
}
