import { Injectable } from '@nestjs/common';
import { CreateTagsDto } from './dto/create-tags.dto';
import { UpdateTagsDto } from './dto/update-tags.dto';
import { TagsRepository } from './infrastructure/persistence/tags.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Tags } from './domain/tags';

@Injectable()
export class TagsService {
  constructor(
    // Dependencies here
    private readonly tagsRepository: TagsRepository,
  ) {}

  
  async create(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createTagsDto: CreateTagsDto
  ) {
    // Do not remove comment below.
    // <creating-property />

    return this.tagsRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.tagsRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Tags['id']) {
    return this.tagsRepository.findById(id);
  }

  findByIds(ids: Tags['id'][]) {
    return this.tagsRepository.findByIds(ids);
  }

  async update(
    id: Tags['id'],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateTagsDto: UpdateTagsDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.tagsRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
    });
  }

  remove(id: Tags['id']) {
    return this.tagsRepository.remove(id);
  }
}
