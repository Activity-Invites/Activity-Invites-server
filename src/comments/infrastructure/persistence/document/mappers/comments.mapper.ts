import { comments } from '../../../../domain/comments';
import { commentsSchemaClass } from '../entities/comments.schema';

export class commentsMapper {
  public static toDomain(raw: commentsSchemaClass): comments {
    const domainEntity = new comments();
    domainEntity.id = raw._id.toString();
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  public static toPersistence(domainEntity: comments): commentsSchemaClass {
    const persistenceSchema = new commentsSchemaClass();
    if (domainEntity.id) {
      persistenceSchema._id = domainEntity.id;
    }
    persistenceSchema.createdAt = domainEntity.createdAt;
    persistenceSchema.updatedAt = domainEntity.updatedAt;

    return persistenceSchema;
  }
}
