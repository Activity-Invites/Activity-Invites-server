import { Location } from '../../../../domain/location';
import { LocationSchemaClass } from '../entities/location.schema';

export class LocationMapper {
  public static toDomain(raw: LocationSchemaClass): Location {
    const domainEntity = new Location();
    domainEntity.id = raw._id.toString();
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  public static toPersistence(domainEntity: Location): LocationSchemaClass {
    const persistenceSchema = new LocationSchemaClass();
    if (domainEntity.id) {
      persistenceSchema._id = domainEntity.id;
    }
    persistenceSchema.createdAt = domainEntity.createdAt;
    persistenceSchema.updatedAt = domainEntity.updatedAt;

    return persistenceSchema;
  }
}
