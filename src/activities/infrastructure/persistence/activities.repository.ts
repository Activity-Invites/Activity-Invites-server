import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { activities } from '../../domain/activities';

export abstract class activitiesRepository {
  abstract create(
    data: Omit<activities, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<activities>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<activities[]>;

  abstract findById(id: activities['id']): Promise<NullableType<activities>>;

  abstract findByIds(ids: activities['id'][]): Promise<activities[]>;

  abstract update(
    id: activities['id'],
    payload: DeepPartial<activities>,
  ): Promise<activities | null>;

  abstract remove(id: activities['id']): Promise<void>;
}
