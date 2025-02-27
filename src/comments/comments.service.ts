import { Injectable } from '@nestjs/common';
import { CreatecommentsDto } from './dto/create-comments.dto';
import { UpdatecommentsDto } from './dto/update-comments.dto';
import { commentsRepository } from './infrastructure/persistence/comments.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { comments } from './domain/comments';

@Injectable()
export class commentsService {
  constructor(
    // Dependencies here
    private readonly commentsRepository: commentsRepository,
  ) {}

  async create(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createcommentsDto: CreatecommentsDto,
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

  findById(id: comments['id']) {
    return this.commentsRepository.findById(id);
  }

  findByIds(ids: comments['id'][]) {
    return this.commentsRepository.findByIds(ids);
  }

  async update(
    id: comments['id'],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updatecommentsDto: UpdatecommentsDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.commentsRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
    });
  }

  remove(id: comments['id']) {
    return this.commentsRepository.remove(id);
  }
}
