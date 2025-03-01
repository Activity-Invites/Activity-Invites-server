import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { SocialCard } from '../../domain/social-card';

export abstract class SocialCardRepository {
  abstract create(
    data: Omit<SocialCard, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<SocialCard>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<SocialCard[]>;

  abstract findById(id: SocialCard['id']): Promise<NullableType<SocialCard>>;

  abstract findByIds(ids: SocialCard['id'][]): Promise<SocialCard[]>;

  abstract update(
    id: SocialCard['id'],
    payload: DeepPartial<SocialCard>,
  ): Promise<SocialCard | null>;

  abstract remove(id: SocialCard['id']): Promise<void>;
}
