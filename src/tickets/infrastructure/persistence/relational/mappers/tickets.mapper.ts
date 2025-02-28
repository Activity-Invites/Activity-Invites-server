import { Tickets } from '../../../../domain/tickets';
import { TicketsEntity } from '../entities/tickets.entity';

export class TicketsMapper {
  static toDomain(raw: TicketsEntity): Tickets {
    const domainEntity = new Tickets();
    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Tickets): TicketsEntity {
    const persistenceEntity = new TicketsEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
