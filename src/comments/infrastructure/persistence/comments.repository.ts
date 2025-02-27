import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { comments } from '../../domain/comments';

export abstract class commentsRepository {
  abstract create(
    data: Omit<comments, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<comments>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<comments[]>;

  abstract findById(id: comments['id']): Promise<NullableType<comments>>;

  abstract findByIds(ids: comments['id'][]): Promise<comments[]>;

  abstract update(
    id: comments['id'],
    payload: DeepPartial<comments>,
  ): Promise<comments | null>;

  abstract remove(id: comments['id']): Promise<void>;
}
