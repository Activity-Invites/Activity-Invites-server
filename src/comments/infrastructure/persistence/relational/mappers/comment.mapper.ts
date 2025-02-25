import { Comment } from '../../../../domain/comment';
import { CommentEntity } from '../entities/comment.entity';
import { ActivityMapper } from '../../../../../activities/infrastructure/persistence/relational/mappers/activity.mapper';
import { UserMapper } from '../../../../../users/infrastructure/persistence/relational/mappers/user.mapper';

export class CommentMapper {
  static toDomain(entity: CommentEntity): Comment {
    const domainEntity = new Comment();
    domainEntity.id = entity.id;
    domainEntity.content = entity.content;
    
    if (entity.activity) {
      domainEntity.activity = ActivityMapper.toDomain(entity.activity);
    }
    
    if (entity.user) {
      domainEntity.user = UserMapper.toDomain(entity.user);
    }
    
    if (entity.parent) {
      domainEntity.parent = CommentMapper.toDomain(entity.parent);
    }
    
    if (entity.replies) {
      domainEntity.replies = entity.replies.map(reply => 
        CommentMapper.toDomain(reply)
      );
    }
    
    domainEntity.isDeleted = entity.isDeleted;
    domainEntity.createdAt = entity.createdAt;
    domainEntity.updatedAt = entity.updatedAt;
    return domainEntity;
  }

  static toPersistence(domain: Comment): CommentEntity {
    const entity = new CommentEntity();
    entity.id = domain.id;
    entity.content = domain.content;
    entity.isDeleted = domain.isDeleted;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }
}
