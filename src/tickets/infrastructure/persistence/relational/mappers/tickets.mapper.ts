import { tickets } from '../../../../domain/tickets';
import { ticketsEntity } from '../entities/tickets.entity';

export class ticketsMapper {
  static toDomain(raw: ticketsEntity): tickets {
    const domainEntity = new tickets();
    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: tickets): ticketsEntity {
    const persistenceEntity = new ticketsEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
