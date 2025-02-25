import { Ticket } from '@/tickets/domain/ticket';
import { TicketEntity } from '../entities/ticket.entity';
import { ActivityMapper } from '@/activities/infrastructure/persistence/relational/mappers/activity.mapper';
import { UserMapper } from '@/users/infrastructure/persistence/relational/mappers/user.mapper';
import { ActivityEntity } from '@/activities/infrastructure/persistence/relational/entities/activity.entity';
import { UserEntity } from '@/users/infrastructure/persistence/relational/entities/user.entity';

export class TicketMapper {
  static toDomain(raw: TicketEntity): Ticket {
    const domainEntity = new Ticket();
    domainEntity.id = raw.id;
    domainEntity.status = raw.status;
    domainEntity.joinTime = raw.joinTime;
    domainEntity.isDeleted = raw.isDeleted;
    // 确保必需的时间字段总是有值
    domainEntity.createdAt = raw.createdAt || new Date();
    domainEntity.updatedAt = raw.updatedAt || new Date();
    domainEntity.deletedAt = raw.deletedAt;

    if (raw.activity) {
      domainEntity.activity = ActivityMapper.toDomain(raw.activity);
    }

    if (raw.user) {
      domainEntity.user = UserMapper.toDomain(raw.user);
    }

    return domainEntity;
  }

  static toPersistence(domain: Ticket): TicketEntity {
    const persistenceEntity = new TicketEntity();
    
    if (domain.id) {
      persistenceEntity.id = domain.id;
    }

    persistenceEntity.status = domain.status;
    persistenceEntity.joinTime = domain.joinTime;
    persistenceEntity.isDeleted = domain.isDeleted;

    // 确保必需的时间字段总是有值
    persistenceEntity.createdAt = domain.createdAt || new Date();
    persistenceEntity.updatedAt = domain.updatedAt || new Date();
    // deletedAt 是可选的
    if (domain.deletedAt) {
      persistenceEntity.deletedAt = domain.deletedAt;
    }

    if (domain.activity) {
      const activity = new ActivityEntity();
      activity.id = domain.activity.id;
      persistenceEntity.activity = activity;
    }

    if (domain.user) {
      const user = new UserEntity();
      user.id = Number(domain.user.id);
      persistenceEntity.user = user;
    }

    return persistenceEntity;
  }
}
