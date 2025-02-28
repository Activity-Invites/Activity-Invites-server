import { Tickets } from '../../../../domain/tickets';
import { TicketsSchemaClass } from '../entities/tickets.schema';

export class TicketsMapper {
  public static toDomain(raw: TicketsSchemaClass): Tickets {
    const domainEntity = new Tickets();
    domainEntity.id = raw._id.toString();
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  public static toPersistence(domainEntity: Tickets): TicketsSchemaClass {
    const persistenceSchema = new TicketsSchemaClass();
    if (domainEntity.id) {
      persistenceSchema._id = domainEntity.id;
    }
    persistenceSchema.createdAt = domainEntity.createdAt;
    persistenceSchema.updatedAt = domainEntity.updatedAt;

    return persistenceSchema;
  }
}
