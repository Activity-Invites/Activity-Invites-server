import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { IPaginationOptions } from '@/utils/types/pagination-options';
import { NullableType } from '@/utils/types/nullable.type';
import { DeepPartial } from '@/utils/types/deep-partial.type';
import { Ticket } from '@/tickets/domain/ticket';
import { FilterTicketDto } from '@/tickets/dto/query-ticket.dto';
import { SortTicketDto } from '@/tickets/dto/sort-ticket.dto';
import { TicketRepository } from '../../ticket.repository';
import { TicketEntity } from '../entities/ticket.entity';
import { TicketMapper } from '../mappers/ticket.mapper';

@Injectable()
export class TicketsRelationalRepository implements TicketRepository {
  constructor(
    @InjectRepository(TicketEntity)
    private readonly ticketsRepository: Repository<TicketEntity>,
  ) {}

  async create(
    data: Omit<Ticket, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'>,
  ): Promise<Ticket> {
    const persistenceModel = TicketMapper.toPersistence(data as Ticket);
    const savedTicket = await this.ticketsRepository.save(persistenceModel);
    return TicketMapper.toDomain(savedTicket);
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
    const queryBuilder = this.ticketsRepository.createQueryBuilder('ticket')
      .leftJoinAndSelect('ticket.activity', 'activity')
      .leftJoinAndSelect('ticket.user', 'user');

    if (filterOptions?.status) {
      queryBuilder.andWhere('ticket.status = :status', {
        status: filterOptions.status,
      });
    }

    if (filterOptions?.activityId) {
      queryBuilder.andWhere('activity.id = :activityId', {
        activityId: filterOptions.activityId,
      });
    }

    if (filterOptions?.userId) {
      queryBuilder.andWhere('user.id = :userId', {
        userId: filterOptions.userId,
      });
    }

    if (sortOptions?.length) {
      sortOptions.forEach((sort) => {
        queryBuilder.addOrderBy(`ticket.${sort.field}`, sort.order);
      });
    }

    const tickets = await queryBuilder
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .take(paginationOptions.limit)
      .getMany();

    return tickets.map((ticket) => TicketMapper.toDomain(ticket));
  }

  async findById(id: Ticket['id']): Promise<NullableType<Ticket>> {
    const queryBuilder = this.ticketsRepository.createQueryBuilder('ticket')
      .leftJoinAndSelect('ticket.activity', 'activity')
      .leftJoinAndSelect('ticket.user', 'user')
      .where('ticket.id = :id', { id });

    const ticket = await queryBuilder.getOne();
    return ticket ? TicketMapper.toDomain(ticket) : null;
  }

  async findByIds(ids: Ticket['id'][]): Promise<Ticket[]> {
    const queryBuilder = this.ticketsRepository.createQueryBuilder('ticket')
      .leftJoinAndSelect('ticket.activity', 'activity')
      .leftJoinAndSelect('ticket.user', 'user')
      .where('ticket.id IN (:...ids)', { ids });

    const tickets = await queryBuilder.getMany();
    return tickets.map((ticket) => TicketMapper.toDomain(ticket));
  }

  async findByActivityId(activityId: string): Promise<Ticket[]> {
    const queryBuilder = this.ticketsRepository.createQueryBuilder('ticket')
      .leftJoinAndSelect('ticket.activity', 'activity')
      .leftJoinAndSelect('ticket.user', 'user')
      .where('activity.id = :activityId', { activityId });

    const tickets = await queryBuilder.getMany();
    return tickets.map((ticket) => TicketMapper.toDomain(ticket));
  }

  async findByUserId(userId: string): Promise<Ticket[]> {
    const queryBuilder = this.ticketsRepository.createQueryBuilder('ticket')
      .leftJoinAndSelect('ticket.activity', 'activity')
      .leftJoinAndSelect('ticket.user', 'user')
      .where('user.id = :userId', { userId });

    const tickets = await queryBuilder.getMany();
    return tickets.map((ticket) => TicketMapper.toDomain(ticket));
  }

  async findByActivityIdAndUserId(
    activityId: string,
    userId: string,
  ): Promise<NullableType<Ticket>> {
    const queryBuilder = this.ticketsRepository.createQueryBuilder('ticket')
      .leftJoinAndSelect('ticket.activity', 'activity')
      .leftJoinAndSelect('ticket.user', 'user')
      .where('activity.id = :activityId', { activityId })
      .andWhere('user.id = :userId', { userId });

    const ticket = await queryBuilder.getOne();
    return ticket ? TicketMapper.toDomain(ticket) : null;
  }

  async update(
    id: Ticket['id'],
    payload: DeepPartial<Ticket>,
  ): Promise<Ticket | null> {
    const persistenceModel = TicketMapper.toPersistence(payload as Ticket);
    await this.ticketsRepository.update(id, persistenceModel);
    return this.findById(id);
  }

  async remove(id: Ticket['id']): Promise<void> {
    await this.ticketsRepository.delete(id);
  }
}