import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TicketSchemaClass } from '../entities/ticket.schema';
import { Ticket } from '@/tickets/domain/ticket';
import { TicketRepository } from '../../ticket.repository';
import { TicketDocumentMapper } from '../mappers/ticket.mapper';
import { NullableType } from '@/utils/types/nullable.type';
import { FilterTicketDto, SortTicketDto } from '@/tickets/dto/query-ticket.dto';
import { IPaginationOptions } from '@/utils/types/pagination-options';
import { IPaginationResponse } from '@/utils/types/pagination-response';
import { DeepPartial } from '@/utils/types/deep-partial.type';

@Injectable()
export class TicketsDocumentRepository implements TicketRepository {
  constructor(
    @InjectModel(TicketSchemaClass.name)
    private readonly ticketModel: Model<TicketSchemaClass>,
  ) {}

  async create(
    data: Omit<Ticket, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'>,
  ): Promise<Ticket> {
    const persistenceModel = TicketDocumentMapper.toDocument(data as Ticket);
    const created = await this.ticketModel.create(persistenceModel);
    return TicketDocumentMapper.toDomain(created);
  }

  async findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterTicketDto | null;
    sortOptions?: SortTicketDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<IPaginationResponse<Ticket>> {
    const query = this.ticketModel.find();

    // 添加过滤条件
    if (filterOptions?.activityId) {
      query.where('activity').equals(filterOptions.activityId);
    }

    if (filterOptions?.userId) {
      query.where('user').equals(filterOptions.userId);
    }

    // 添加排序
    if (sortOptions?.length) {
      const sortCriteria = sortOptions.reduce(
        (acc, { orderBy, order }) => ({ ...acc, [orderBy]: order }),
        {},
      );
      query.sort(sortCriteria);
    } else {
      // 默认按创建时间倒序排序
      query.sort({ createdAt: -1 });
    }

    // 添加分页和关联
    query.populate(['activity', 'user']);
    
    const total = await this.ticketModel.countDocuments(query.getQuery());
    const documents = await query
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit)
      .exec();

    return {
      items: documents.map(doc => TicketDocumentMapper.toDomain(doc)),
      total,
    };
  }

  async findById(id: string): Promise<NullableType<Ticket>> {
    const document = await this.ticketModel
      .findById(id)
      .populate(['activity', 'user'])
      .exec();
    return document ? TicketDocumentMapper.toDomain(document) : null;
  }

  async findByIds(ids: string[]): Promise<Ticket[]> {
    const documents = await this.ticketModel
      .find({ _id: { $in: ids } })
      .populate(['activity', 'user'])
      .exec();
    return documents.map(doc => TicketDocumentMapper.toDomain(doc));
  }

  async findByActivityId(activityId: string): Promise<Ticket[]> {
    const documents = await this.ticketModel
      .find({ activity: activityId })
      .populate(['activity', 'user'])
      .sort({ createdAt: -1 })
      .exec();
    return documents.map(doc => TicketDocumentMapper.toDomain(doc));
  }

  async findByUserId(userId: string): Promise<Ticket[]> {
    const documents = await this.ticketModel
      .find({ user: userId })
      .populate(['activity', 'user'])
      .sort({ createdAt: -1 })
      .exec();
    return documents.map(doc => TicketDocumentMapper.toDomain(doc));
  }

  async findByActivityIdAndUserId(
    activityId: string,
    userId: string,
  ): Promise<NullableType<Ticket>> {
    const document = await this.ticketModel
      .findOne({
        activity: activityId,
        user: userId,
      })
      .populate(['activity', 'user'])
      .exec();
    return document ? TicketDocumentMapper.toDomain(document) : null;
  }

  async update(
    id: string,
    payload: DeepPartial<Ticket>,
  ): Promise<Ticket | null> {
    const persistenceModel = TicketDocumentMapper.toDocument(payload as Ticket);
    await this.ticketModel
      .findByIdAndUpdate(id, { $set: persistenceModel })
      .exec();
    return this.findById(id);
  }

  async remove(id: string): Promise<void> {
    await this.ticketModel.findByIdAndDelete(id).exec();
  }

  async restore(id: string): Promise<void> {
    await this.ticketModel
      .findByIdAndUpdate(id, {
        $set: { isDeleted: false, deletedAt: null },
      })
      .exec();
  }

  async softRemove(id: string): Promise<void> {
    await this.ticketModel
      .findByIdAndUpdate(id, {
        $set: { isDeleted: true, deletedAt: new Date() },
      })
      .exec();
  }
}