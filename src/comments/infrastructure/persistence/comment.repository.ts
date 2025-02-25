import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Comment } from '../../domain/comment';
import { FilterCommentDto, SortCommentDto } from '../../dto/query-comment.dto';

export abstract class CommentRepository {
  abstract create(
    data: Omit<Comment, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'>,
  ): Promise<Comment>;

  abstract findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterCommentDto | null;
    sortOptions?: SortCommentDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Comment[]>;

  abstract findById(id: Comment['id']): Promise<NullableType<Comment>>;
  abstract findByIds(ids: Comment['id'][]): Promise<Comment[]>;
  abstract findByActivityId(activityId: string): Promise<Comment[]>;
  abstract findByUserId(userId: string): Promise<Comment[]>;

  abstract update(
    id: Comment['id'],
    payload: DeepPartial<Comment>,
  ): Promise<Comment | null>;

  abstract remove(id: Comment['id']): Promise<void>;
}
