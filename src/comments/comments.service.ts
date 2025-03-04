import { Injectable } from '@nestjs/common';
import { CreateCommentsDto } from './dto/create-comments.dto';
import { UpdateCommentsDto } from './dto/update-comments.dto';
import { CommentsRepository } from './repositories/comments.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Comments } from './domain/comments';

@Injectable()
export class CommentsService {
  constructor(
    // Dependencies here
    private readonly commentsRepository: CommentsRepository,
  ) {}

  async create(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createCommentsDto: CreateCommentsDto,
  ) {
    // Do not remove comment below.
    // <creating-property />

    return this.commentsRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.commentsRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Comments['id']) {
    return this.commentsRepository.findById(id);
  }

  findByIds(ids: Comments['id'][]) {
    return this.commentsRepository.findByIds(ids);
  }

  async update(
    id: Comments['id'],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateCommentsDto: UpdateCommentsDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.commentsRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
    });
  }

  remove(id: Comments['id']) {
    return this.commentsRepository.remove(id);
  }
}
