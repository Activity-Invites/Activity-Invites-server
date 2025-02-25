import { Ticket } from '@/tickets/domain/ticket';
import { TicketDocument } from '../entities/ticket.schema';
import { Types } from 'mongoose';
import { ActivityDocumentMapper } from '@/activities/infrastructure/persistence/document/mappers/activity.mapper';
import { UserMapper } from '@/users/infrastructure/persistence/document/mappers/user.mapper';

export class TicketDocumentMapper {
  static toDomain(document: TicketDocument): Ticket {
    const domain = new Ticket();
    domain.id = document._id.toString();
    domain.status = document.status;
    domain.joinTime = document.joinTime;
    domain.isDeleted = document.isDeleted;
    // createdAt 和 updatedAt 是必需的，所以我们总是创建一个新的 Date
    domain.createdAt = new Date(document.createdAt || Date.now());
    domain.updatedAt = new Date(document.updatedAt || Date.now());
    domain.deletedAt = document.deletedAt ? new Date(document.deletedAt) : undefined;

    if (document.activity && typeof document.activity !== 'string') {
      domain.activity = ActivityDocumentMapper.toDomain(
        document.activity,
      );
    }

    if (document.user) {
      domain.user = UserMapper.toDomain(
        document.user,
      );
    }

    return domain;
  }

  static toDocument(domain: Ticket): Partial<TicketDocument> {
    const document: any = {
      status: domain.status,
      joinTime: domain.joinTime,
      isDeleted: domain.isDeleted,
    };

    if (domain.id) {
      document._id = new Types.ObjectId(domain.id);
    }

    if (domain.activity) {
      document.activity = new Types.ObjectId(domain.activity.id);
    }

    if (domain.user) {
      document.user = new Types.ObjectId(domain.user.id);
    }

    // createdAt 和 updatedAt 是必需的
    document.createdAt = domain.createdAt.getTime();
    document.updatedAt = domain.updatedAt.getTime();

    if (domain.deletedAt) {
      document.deletedAt = domain.deletedAt.getTime();
    }

    return document;
  }
}
