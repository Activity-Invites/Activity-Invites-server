import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Themes } from '../../domain/themes';

export abstract class ThemesRepository {
  abstract create(
    data: Omit<Themes, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Themes>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
    }): Promise<Themes[]>;

  abstract findById(id: Themes['id']): Promise<NullableType<Themes>>;

  abstract findByIds(ids: Themes['id'][]): Promise<Themes[]>;

  abstract update(
    id: Themes['id'],
    payload: DeepPartial<Themes>,
  ): Promise<Themes | null>;

  abstract remove(id: Themes['id']): Promise<void>;
}
