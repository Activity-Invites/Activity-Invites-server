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
    
    if (domain.activity) {
      entity.activity = ActivityMapper.toPersistence(domain.activity);
    }
    
    if (domain.user) {
      entity.user = UserMapper.toPersistence(domain.user);
    }
    
    if (domain.parent) {
      entity.parent = CommentMapper.toPersistence(domain.parent);
    }
    
    if (domain.replies) {
      entity.replies = domain.replies.map(reply => 
        CommentMapper.toPersistence(reply)
      );
    }
    
    if (domain.createdAt) {
      entity.createdAt = domain.createdAt;
    }
    
    if (domain.updatedAt) {
      entity.updatedAt = domain.updatedAt;
    }
    
    if (domain.deletedAt) {
      entity.deletedAt = domain.deletedAt;
    }
    
    return entity;
  }
}
