import { Activity } from '@/activities/domain/activity';
import { ActivityEntity } from '../entities/activity.entity';
import { ThemeMapper } from '@/themes/infrastructure/persistence/relational/mappers/theme.mapper';
import { TicketMapper } from '@/tickets/infrastructure/persistence/relational/mappers/ticket.mapper';
import { UserMapper } from '@/users/infrastructure/persistence/relational/mappers/user.mapper';
import { CommentMapper } from '@/comments/infrastructure/persistence/relational/mappers/comment.mapper';

export class ActivityMapper {
  static toDomain(entity: ActivityEntity): Activity {
    const domainEntity = new Activity();
    domainEntity.id = entity.id;
    domainEntity.name = entity.name;
    domainEntity.mainImage = entity.mainImage;
    domainEntity.introImages = entity.introImages;
    domainEntity.startTime = entity.startTime;
    domainEntity.endTime = entity.endTime;
    domainEntity.location = entity.location;
    domainEntity.isPublic = entity.isPublic;
    domainEntity.description = entity.description;
    domainEntity.status = entity.status;
    domainEntity.type = entity.type;
    domainEntity.minParticipants = entity.minParticipants;
    domainEntity.maxParticipants = entity.maxParticipants;
    domainEntity.waitingListLimit = entity.waitingListLimit;
    domainEntity.currentParticipants = entity.currentParticipants;
    domainEntity.isDeleted = entity.deletedAt !== null;
    
    if (entity.creator) {
      domainEntity.creator = UserMapper.toDomain(entity.creator);
    }
    
    if (entity.theme) {
      domainEntity.theme = ThemeMapper.toDomain(entity.theme);
    }
    
    if (entity.tickets) {
      domainEntity.tickets = entity.tickets.map(ticket => 
        TicketMapper.toDomain(ticket)
      );
    }
    
    if (entity.comments) {
      domainEntity.comments = entity.comments.map(comment => 
        CommentMapper.toDomain(comment)
      );
    }
    
    if (entity.participants) {
      domainEntity.participants = entity.participants.map((participant) =>
        UserMapper.toDomain(participant),
      );
    }
    
    domainEntity.createdAt = entity.createdAt;
    domainEntity.updatedAt = entity.updatedAt;
    domainEntity.deletedAt = entity.deletedAt;
    
    return domainEntity;
  }

  static toPersistence(domain: Activity): ActivityEntity {
    const entity = new ActivityEntity();
    
    if (domain.id) {
      entity.id = domain.id;
    }
    
    entity.name = domain.name;
    entity.mainImage = domain.mainImage;
    entity.introImages = domain.introImages;
    entity.startTime = domain.startTime;
    entity.endTime = domain.endTime;
    entity.location = domain.location;
    entity.isPublic = domain.isPublic;
    entity.description = domain.description;
    entity.status = domain.status;
    entity.type = domain.type;
    entity.minParticipants = domain.minParticipants;
    entity.maxParticipants = domain.maxParticipants;
    entity.waitingListLimit = domain.waitingListLimit;
    entity.currentParticipants = domain.currentParticipants;
    
    if (domain.creator) {
      entity.creator = UserMapper.toPersistence(domain.creator);
    }
    
    if (domain.theme) {
      entity.theme = ThemeMapper.toPersistence(domain.theme);
    }
    
    if (domain.tickets) {
      entity.tickets = domain.tickets.map(ticket => 
        TicketMapper.toPersistence(ticket)
      );
    }
    
    if (domain.comments) {
      entity.comments = domain.comments.map(comment => 
        CommentMapper.toPersistence(comment)
      );
    }
    
    if (domain.participants) {
      entity.participants = domain.participants.map((participant) =>
        UserMapper.toPersistence(participant),
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
