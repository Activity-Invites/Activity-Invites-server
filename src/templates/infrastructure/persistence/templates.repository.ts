import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Templates } from '../../domain/templates';

export abstract class TemplatesRepository {
  abstract create(
    data: Omit<Templates, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Templates>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Templates[]>;

  abstract findById(id: Templates['id']): Promise<NullableType<Templates>>;

  abstract findByIds(ids: Templates['id'][]): Promise<Templates[]>;

  abstract update(
    id: Templates['id'],
    payload: DeepPartial<Templates>,
  ): Promise<Templates | null>;

  abstract remove(id: Templates['id']): Promise<void>;
}
