import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Activities } from '../../domain/activities';

export abstract class ActivitiesRepository {
  abstract create(
    data: Omit<Activities, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Activities>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Activities[]>;

  abstract findById(id: Activities['id']): Promise<NullableType<Activities>>;

  abstract findByIds(ids: Activities['id'][]): Promise<Activities[]>;

  abstract update(
    id: Activities['id'],
    payload: DeepPartial<Activities>,
  ): Promise<Activities | null>;

  abstract remove(id: Activities['id']): Promise<void>;
}
