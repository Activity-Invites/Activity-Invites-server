import { Activity } from '@/activities/domain/activities.entity';
import { ActivityEntity } from '../entities/activity.entity';

export class ActivityMapper {
  static toDomain(entity: ActivityEntity): Activity {
    // return new Activity({
    //   id: entity.id,
    //   name: entity.name,
    //   mainImage: entity.mainImage,
    //   introImages: entity.introImages,
    //   startTime: entity.startTime,
    //   endTime: entity.endTime,
    //   location: entity.location,
    //   isPublic: entity.isPublic,
    //   description: entity.description,
    //   status: entity.status,
    //   type: entity.type,
    //   minParticipants: entity.minParticipants,
    //   maxParticipants: entity.maxParticipants,
    //   waitingListLimit: entity.waitingListLimit,
    //   currentParticipants: entity.currentParticipants,
    //   creatorId: entity.creator?.id,
    //   themeId: entity.theme?.id,
    //   createdAt: entity.createdAt,
    //   updatedAt: entity.updatedAt,
    // });
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
    domainEntity.creator = entity.creator;
    domainEntity.theme = entity.theme;
    domainEntity.createdAt = entity.createdAt;
    domainEntity.updatedAt = entity.updatedAt;
    return domainEntity;
  }

  static toPersistence(domainEntity: Activity): Partial<ActivityEntity> {
    const entity = new ActivityEntity();
    if (domainEntity.id) entity.id = domainEntity.id;
    entity.name = domainEntity.name;
    entity.mainImage = domainEntity.mainImage;
    entity.introImages = domainEntity.introImages;
    entity.startTime = domainEntity.startTime;
    entity.endTime = domainEntity.endTime;
    entity.location = domainEntity.location;
    entity.isPublic = domainEntity.isPublic;
    entity.description = domainEntity.description;
    entity.status = domainEntity.status;
    entity.type = domainEntity.type;
    entity.minParticipants = domainEntity.minParticipants;
    entity.maxParticipants = domainEntity.maxParticipants;
    entity.waitingListLimit = domainEntity.waitingListLimit;
    entity.currentParticipants = domainEntity.currentParticipants;
    if (domainEntity.creator) entity.creator = { id: domainEntity.creator.id } as any;
    if (domainEntity.theme) entity.theme = { id: domainEntity.theme.id } as any;
    return entity;
  }
}
