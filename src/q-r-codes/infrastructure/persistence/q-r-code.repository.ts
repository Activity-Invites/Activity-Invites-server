import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { QRCode } from '../../domain/q-r-code';

export abstract class QRCodeRepository {
  abstract create(
    data: Omit<QRCode, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<QRCode>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<QRCode[]>;

  abstract findById(id: QRCode['id']): Promise<NullableType<QRCode>>;

  abstract findByIds(ids: QRCode['id'][]): Promise<QRCode[]>;

  abstract update(
    id: QRCode['id'],
    payload: DeepPartial<QRCode>,
  ): Promise<QRCode | null>;

  abstract remove(id: QRCode['id']): Promise<void>;
}
