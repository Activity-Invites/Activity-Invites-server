import { Comments } from '../../../../domain/comments';
import { CommentsSchemaClass } from '../entities/comments.schema';

export class CommentsMapper {
  public static toDomain(raw: CommentsSchemaClass): Comments {
    const domainEntity = new Comments();
    domainEntity.id = raw._id.toString();
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  public static toPersistence(domainEntity: Comments): CommentsSchemaClass {
    const persistenceSchema = new CommentsSchemaClass();
    if (domainEntity.id) {
      persistenceSchema._id = domainEntity.id;
    }
    persistenceSchema.createdAt = domainEntity.createdAt;
    persistenceSchema.updatedAt = domainEntity.updatedAt;

    return persistenceSchema;
  }
}
