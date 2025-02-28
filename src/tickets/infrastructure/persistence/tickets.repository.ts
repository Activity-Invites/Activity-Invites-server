import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Tickets } from '../../domain/tickets';

export abstract class TicketsRepository {
  abstract create(
    data: Omit<Tickets, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Tickets>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
    }): Promise<Tickets[]>;

  abstract findById(id: Tickets['id']): Promise<NullableType<Tickets>>;

  abstract findByIds(ids: Tickets['id'][]): Promise<Tickets[]>;

  abstract update(
    id: Tickets['id'],
    payload: DeepPartial<Tickets>,
  ): Promise<Tickets | null>;

  abstract remove(id: Tickets['id']): Promise<void>;
}
