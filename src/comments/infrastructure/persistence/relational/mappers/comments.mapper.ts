import { Comments } from '../../../../domain/comments';
import { CommentsEntity } from '../entities/comments.entity';

export class commentsMapper {
  static toDomain(raw: CommentsEntity): Comments {
    const domainEntity = new Comments();
    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Comments): CommentsEntity {
    const persistenceEntity = new CommentsEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
