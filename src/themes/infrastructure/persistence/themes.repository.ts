import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { themes } from '../../domain/themes';

export abstract class themesRepository {
  abstract create(
    data: Omit<themes, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<themes>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<themes[]>;

  abstract findById(id: themes['id']): Promise<NullableType<themes>>;

  abstract findByIds(ids: themes['id'][]): Promise<themes[]>;

  abstract update(
    id: themes['id'],
    payload: DeepPartial<themes>,
  ): Promise<themes | null>;

  abstract remove(id: themes['id']): Promise<void>;
}
