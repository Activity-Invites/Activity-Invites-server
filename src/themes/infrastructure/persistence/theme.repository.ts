import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Theme } from '../../domain/theme';
import { FilterThemeDto, SortThemeDto } from '../../dto/query-theme.dto';

export abstract class ThemeRepository {
  abstract create(
    data: Omit<Theme, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'>,
  ): Promise<Theme>;

  abstract findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterThemeDto | null;
    sortOptions?: SortThemeDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Theme[]>;

  abstract findById(id: Theme['id']): Promise<NullableType<Theme>>;
  abstract findByIds(ids: Theme['id'][]): Promise<Theme[]>;
  abstract findByName(name: string): Promise<Theme[]>;
  abstract findByCategory(category: string): Promise<Theme[]>;

  abstract update(
    id: Theme['id'],
    payload: DeepPartial<Theme>,
  ): Promise<Theme | null>;

  abstract remove(id: Theme['id']): Promise<void>;
}
