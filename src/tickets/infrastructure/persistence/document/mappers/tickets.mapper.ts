import { tickets } from '../../../../domain/tickets';
import { ticketsSchemaClass } from '../entities/tickets.schema';

export class ticketsMapper {
  public static toDomain(raw: ticketsSchemaClass): tickets {
    const domainEntity = new tickets();
    domainEntity.id = raw._id.toString();
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  public static toPersistence(domainEntity: tickets): ticketsSchemaClass {
    const persistenceSchema = new ticketsSchemaClass();
    if (domainEntity.id) {
      persistenceSchema._id = domainEntity.id;
    }
    persistenceSchema.createdAt = domainEntity.createdAt;
    persistenceSchema.updatedAt = domainEntity.updatedAt;

    return persistenceSchema;
  }
}
