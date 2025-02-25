import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TicketEntity } from '../entities/ticket.entity';
import { TicketRepository } from '../../ticket.repository';
import { Ticket } from '@/tickets/domain/ticket';
import { TicketMapper } from '../mappers/ticket.mapper';
import { NullableType } from '@/utils/types/nullable.type';
import { FilterTicketDto, SortTicketDto } from '@/tickets/dto/query-ticket.dto';
import { IPaginationOptions } from '@/utils/types/pagination-options';
import { IPaginationResponse } from '@/utils/types/pagination-response';
import { DeepPartial } from '@/utils/types/deep-partial.type';

@Injectable()
export class TicketsRelationalRepository implements TicketRepository {
  constructor(
    @InjectRepository(TicketEntity)
    private readonly ticketRepository: Repository<TicketEntity>,
  ) {}

  async create(
    data: Omit<Ticket, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'>,
  ): Promise<Ticket> {
    const persistenceModel = TicketMapper.toPersistence(data as Ticket);
    const created = await this.ticketRepository.save(persistenceModel);
    return TicketMapper.toDomain(created);
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
    const query = this.ticketRepository.createQueryBuilder('ticket');

    // 添加关联
    query.leftJoinAndSelect('ticket.activity', 'activity');
    query.leftJoinAndSelect('ticket.user', 'user');

    // 添加过滤条件
    if (filterOptions?.activityId) {
      query.andWhere('activity.id = :activityId', {
        activityId: filterOptions.activityId,
      });
    }

    if (filterOptions?.userId) {
      query.andWhere('user.id = :userId', {
        userId: filterOptions.userId,
      });
    }

    // 添加排序
    if (sortOptions?.length) {
      sortOptions.forEach(({ orderBy, order }) => {
        query.addOrderBy(`ticket.${orderBy}`, order);
      });
    } else {
      // 默认按创建时间倒序排序
      query.orderBy('ticket.createdAt', 'DESC');
    }

    // 添加分页
    const total = await query.getCount();
    const entities = await query
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .take(paginationOptions.limit)
      .getMany();

    return {
      items: entities.map(entity => TicketMapper.toDomain(entity)),
      total,
    };
  }

  async findById(id: string): Promise<NullableType<Ticket>> {
    const entity = await this.ticketRepository
      .createQueryBuilder('ticket')
      .leftJoinAndSelect('ticket.activity', 'activity')
      .leftJoinAndSelect('ticket.user', 'user')
      .where('ticket.id = :id', { id })
      .getOne();
    return entity ? TicketMapper.toDomain(entity) : null;
  }

  async findByIds(ids: string[]): Promise<Ticket[]> {
    const entities = await this.ticketRepository
      .createQueryBuilder('ticket')
      .leftJoinAndSelect('ticket.activity', 'activity')
      .leftJoinAndSelect('ticket.user', 'user')
      .where('ticket.id IN (:...ids)', { ids })
      .getMany();
    return entities.map(entity => TicketMapper.toDomain(entity));
  }

  async findByActivityId(activityId: string): Promise<Ticket[]> {
    const entities = await this.ticketRepository
      .createQueryBuilder('ticket')
      .leftJoinAndSelect('ticket.activity', 'activity')
      .leftJoinAndSelect('ticket.user', 'user')
      .where('activity.id = :activityId', { activityId })
      .orderBy('ticket.createdAt', 'DESC')
      .getMany();
    return entities.map(entity => TicketMapper.toDomain(entity));
  }

  async findByUserId(userId: string): Promise<Ticket[]> {
    const entities = await this.ticketRepository
      .createQueryBuilder('ticket')
      .leftJoinAndSelect('ticket.activity', 'activity')
      .leftJoinAndSelect('ticket.user', 'user')
      .where('user.id = :userId', { userId })
      .orderBy('ticket.createdAt', 'DESC')
      .getMany();
    return entities.map(entity => TicketMapper.toDomain(entity));
  }

  async findByActivityIdAndUserId(
    activityId: string,
    userId: string,
  ): Promise<NullableType<Ticket>> {
    const entity = await this.ticketRepository
      .createQueryBuilder('ticket')
      .leftJoinAndSelect('ticket.activity', 'activity')
      .leftJoinAndSelect('ticket.user', 'user')
      .where('activity.id = :activityId', { activityId })
      .andWhere('user.id = :userId', { userId })
      .getOne();
    return entity ? TicketMapper.toDomain(entity) : null;
  }

  async update(
    id: string,
    payload: DeepPartial<Ticket>,
  ): Promise<Ticket | null> {
    const persistenceModel = TicketMapper.toPersistence(
      payload as Ticket,
    );
    await this.ticketRepository.update(id, persistenceModel);
    return this.findById(id);
  }

  async remove(id: string): Promise<void> {
    await this.ticketRepository.delete(id);
  }

  async restore(id: string): Promise<void> {
    await this.ticketRepository
      .createQueryBuilder()
      .update(TicketEntity)
      .set({
        isDeleted: false,
        deletedAt: undefined,
      })
      .where('id = :id', { id })
      .execute();
  }

  async softRemove(id: string): Promise<void> {
    await this.ticketRepository
      .createQueryBuilder()
      .update(TicketEntity)
      .set({
        isDeleted: true,
        deletedAt: () => 'CURRENT_TIMESTAMP',
      })
      .where('id = :id', { id })
      .execute();
  }
}