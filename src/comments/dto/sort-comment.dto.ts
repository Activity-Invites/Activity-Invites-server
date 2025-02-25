import { SortOrder } from '@/utils/enum/sort-order';

export class SortCommentDto {
  field: 'id' | 'content' | 'createdAt' | 'updatedAt';
  order: SortOrder;
}
