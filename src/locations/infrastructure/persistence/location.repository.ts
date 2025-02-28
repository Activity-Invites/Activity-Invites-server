import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Location } from '../../domain/location';

export abstract class LocationRepository {
  abstract create(
    data: Omit<Location, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Location>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Location[]>;

  abstract findById(id: Location['id']): Promise<NullableType<Location>>;

  abstract findByIds(ids: Location['id'][]): Promise<Location[]>;

  abstract update(
    id: Location['id'],
    payload: DeepPartial<Location>,
  ): Promise<Location | null>;

  abstract remove(id: Location['id']): Promise<void>;
}
