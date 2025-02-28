import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Comments } from '../../domain/comments';

export abstract class CommentsRepository {
  abstract create(
    data: Omit<Comments, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Comments>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Comments[]>;

  abstract findById(id: Comments['id']): Promise<NullableType<Comments>>;

  abstract findByIds(ids: Comments['id'][]): Promise<Comments[]>;

  abstract update(
    id: Comments['id'],
    payload: DeepPartial<Comments>,
  ): Promise<Comments | null>;

  abstract remove(id: Comments['id']): Promise<void>;
}
