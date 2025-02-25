import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Ticket } from '../../domain/ticket';
import { FilterTicketDto, SortTicketDto } from '../../dto/query-ticket.dto';

export abstract class TicketRepository {
  abstract create(
    data: Omit<Ticket, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'>,
  ): Promise<Ticket>;

  abstract findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterTicketDto | null;
    sortOptions?: SortTicketDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Ticket[]>;

  abstract findById(id: Ticket['id']): Promise<NullableType<Ticket>>;
  abstract findByIds(ids: Ticket['id'][]): Promise<Ticket[]>;
  abstract findByActivityId(activityId: string): Promise<Ticket[]>;
  abstract findByUserId(userId: string): Promise<Ticket[]>;
  abstract findByActivityIdAndUserId(activityId: string, userId: string): Promise<NullableType<Ticket>>;

  abstract update(
    id: Ticket['id'],
    payload: DeepPartial<Ticket>,
  ): Promise<Ticket | null>;

  abstract remove(id: Ticket['id']): Promise<void>;
}
