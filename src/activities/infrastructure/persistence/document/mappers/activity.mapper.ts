import { Activity } from '@/activities/domain/activity';
import { ActivityDocument } from '../entities/activity.schema';
import { ThemeDocumentMapper } from '@/themes/infrastructure/persistence/document/mappers/theme.mapper';
import { TicketDocumentMapper } from '@/tickets/infrastructure/persistence/document/mappers/ticket.mapper';
import { UserMapper } from '@/users/infrastructure/persistence/document/mappers/user.mapper';
import { CommentDocumentMapper } from '@/comments/infrastructure/persistence/document/mappers/comment.mapper';

export class ActivityDocumentMapper {
  static toDomain(
    document: ActivityDocument & {
      creator?: any;
      theme?: any;
      tickets?: any[];
      comments?: any[];
    },
  ): Activity {
    const domainEntity = new Activity();
    domainEntity.id = document._id.toString();
    domainEntity.name = document.name;
    domainEntity.mainImage = document.mainImage;
    domainEntity.introImages = document.introImages;
    domainEntity.startTime = new Date(document.startTime);
    domainEntity.endTime = new Date(document.endTime);
    domainEntity.location = document.location;
    domainEntity.isPublic = document.isPublic;
    domainEntity.description = document.description;
    domainEntity.status = document.status;
    domainEntity.type = document.type;
    domainEntity.minParticipants = document.minParticipants;
    domainEntity.maxParticipants = document.maxParticipants;
    domainEntity.waitingListLimit = document.waitingListLimit;
    domainEntity.currentParticipants = document.currentParticipants;
    domainEntity.isDeleted = !!document.deletedAt;

    if (document.creator && typeof document.creator !== 'string') {
      domainEntity.creator = UserMapper.toDomain(document.creator);
    }

    if (document.theme && typeof document.theme !== 'string') {
      domainEntity.theme = ThemeDocumentMapper.toDomain(document.theme);
    }

    if (document.tickets && Array.isArray(document.tickets)) {
      domainEntity.tickets = document.tickets
        .filter((ticket) => typeof ticket !== 'string')
        .map((ticket) => TicketDocumentMapper.toDomain(ticket));
    }

    if (document.comments && Array.isArray(document.comments)) {
      domainEntity.comments = document.comments
        .filter((comment) => typeof comment !== 'string')
        .map((comment) => CommentDocumentMapper.toDomain(comment));
    }

    domainEntity.createdAt =new Date(document.createdAt);
    domainEntity.updatedAt =  new Date(document.updatedAt) ;
    domainEntity.deletedAt = document.deletedAt ? new Date(document.deletedAt) : undefined;

    return domainEntity;
  }

  static toPersistence(domain: Activity): Partial<ActivityDocument> {
    const document: any = {
      name: domain.name,
      mainImage: domain.mainImage,
      introImages: domain.introImages,
      startTime: domain.startTime ? domain.startTime.getTime() : undefined,
      endTime: domain.endTime ? domain.endTime.getTime() : undefined,
      location: domain.location,
      isPublic: domain.isPublic,
      description: domain.description,
      status: domain.status,
      type: domain.type,
      minParticipants: domain.minParticipants,
      maxParticipants: domain.maxParticipants,
      waitingListLimit: domain.waitingListLimit,
      currentParticipants: domain.currentParticipants,
    };

    if (domain.id) {
      document._id = domain.id;
    }

    if (domain.creator) {
      document.creator = domain.creator.id;
    }

    if (domain.theme) {
      document.theme = domain.theme.id;
    }

    if (domain.tickets) {
      document.tickets = domain.tickets.map((ticket) => ticket.id);
    }

    if (domain.comments) {
      document.comments = domain.comments.map((comment) => comment.id);
    }

    if (domain.createdAt) {
      document.createdAt = domain.createdAt.getTime();
    }

    if (domain.updatedAt) {
      document.updatedAt = domain.updatedAt.getTime();
    }

    if (domain.deletedAt) {
      document.deletedAt = domain.deletedAt.getTime();
    }

    return document;
  }
}
