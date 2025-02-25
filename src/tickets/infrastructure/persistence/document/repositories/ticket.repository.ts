import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { IPaginationOptions } from '@/utils/types/pagination-options';
import { NullableType } from '@/utils/types/nullable.type';
import { DeepPartial } from '@/utils/types/deep-partial.type';
import { Ticket } from '@/tickets/domain/ticket';
import { FilterTicketDto } from '@/tickets/dto/query-ticket.dto';
import { SortTicketDto } from '@/tickets/dto/sort-ticket.dto';
import { TicketRepository } from '../../ticket.repository';
import { TicketSchemaClass } from '../entities/ticket.schema';
import { TicketDocumentMapper } from '../mappers/ticket.mapper';

@Injectable()
export class TicketsDocumentRepository implements TicketRepository {
  constructor(
    @InjectModel(TicketSchemaClass.name)
    private readonly ticketsModel: Model<TicketSchemaClass>,
  ) {}

  async create(
    data: Omit<Ticket, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'>,
  ): Promise<Ticket> {
    const persistenceModel = TicketDocumentMapper.toDocument(data as Ticket);
    const createdTicket = new this.ticketsModel(persistenceModel);
    const ticketObject = await createdTicket.save();
    return TicketDocumentMapper.toDomain(ticketObject);
  }

  async findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterTicketDto | null;
    sortOptions?: SortTicketDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Ticket[]> {
    const where: FilterQuery<TicketSchemaClass> = {};

    if (filterOptions?.status) {
      where.status = filterOptions.status;
    }

    if (filterOptions?.activityId) {
      where['activity._id'] = filterOptions.activityId;
    }

    if (filterOptions?.userId) {
      where['user._id'] = filterOptions.userId;
    }

    const tickets = await this.ticketsModel
      .find(where)
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit)
      .exec();

    return tickets.map((ticket) => TicketDocumentMapper.toDomain(ticket));
  }

  async findById(id: Ticket['id']): Promise<NullableType<Ticket>> {
    const ticket = await this.ticketsModel.findById(id).exec();
    return ticket ? TicketDocumentMapper.toDomain(ticket) : null;
  }

  async findByIds(ids: Ticket['id'][]): Promise<Ticket[]> {
    const tickets = await this.ticketsModel.find({ _id: { $in: ids } }).exec();
    return tickets.map((ticket) => TicketDocumentMapper.toDomain(ticket));
  }

  async findByActivityId(activityId: string): Promise<Ticket[]> {
    const tickets = await this.ticketsModel
      .find({ 'activity._id': activityId })
      .exec();
    return tickets.map((ticket) => TicketDocumentMapper.toDomain(ticket));
  }

  async findByUserId(userId: string): Promise<Ticket[]> {
    const tickets = await this.ticketsModel
      .find({ 'user._id': userId })
      .exec();
    return tickets.map((ticket) => TicketDocumentMapper.toDomain(ticket));
  }

  async findByActivityIdAndUserId(
    activityId: string,
    userId: string,
  ): Promise<NullableType<Ticket>> {
    const ticket = await this.ticketsModel
      .findOne({
        'activity._id': activityId,
        'user._id': userId,
      })
      .exec();
    return ticket ? TicketDocumentMapper.toDomain(ticket) : null;
  }

  async update(
    id: Ticket['id'],
    payload: DeepPartial<Ticket>,
  ): Promise<Ticket | null> {
    const persistenceModel = TicketDocumentMapper.toDocument(payload as Ticket);
    const updatedTicket = await this.ticketsModel
      .findByIdAndUpdate(id, persistenceModel, { new: true })
      .exec();
    return updatedTicket ? TicketDocumentMapper.toDomain(updatedTicket) : null;
  }

  async remove(id: Ticket['id']): Promise<void> {
    await this.ticketsModel.findByIdAndDelete(id).exec();
  }
}