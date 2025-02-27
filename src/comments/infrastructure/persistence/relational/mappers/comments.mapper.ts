import { comments } from '../../../../domain/comments';
import { commentsEntity } from '../entities/comments.entity';

export class commentsMapper {
  static toDomain(raw: commentsEntity): comments {
    const domainEntity = new comments();
    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: comments): commentsEntity {
    const persistenceEntity = new commentsEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
