import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { tickets } from '../../domain/tickets';

export abstract class TicketsRepository {
  abstract create(
    data: Omit<tickets, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<tickets>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<tickets[]>;

  abstract findById(id: tickets['id']): Promise<NullableType<tickets>>;

  abstract findByIds(ids: tickets['id'][]): Promise<tickets[]>;

  abstract update(
    id: tickets['id'],
    payload: DeepPartial<tickets>,
  ): Promise<tickets | null>;

  abstract remove(id: tickets['id']): Promise<void>;
}
