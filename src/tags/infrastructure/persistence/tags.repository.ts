import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Tags } from '../../domain/tags';

export abstract class TagsRepository {
  abstract create(
    data: Omit<Tags, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Tags>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Tags[]>;

  abstract findById(id: Tags['id']): Promise<NullableType<Tags>>;

  abstract findByIds(ids: Tags['id'][]): Promise<Tags[]>;

  abstract update(
    id: Tags['id'],
    payload: DeepPartial<Tags>,
  ): Promise<Tags | null>;

  abstract remove(id: Tags['id']): Promise<void>;
}
