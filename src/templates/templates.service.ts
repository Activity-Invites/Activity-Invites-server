import { Injectable } from '@nestjs/common';
import { CreateTemplatesDto } from './dto/create-templates.dto';
import { UpdateTemplatesDto } from './dto/update-templates.dto';
import { TemplatesRepository } from './infrastructure/persistence/templates.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Templates } from './domain/templates';

@Injectable()
export class TemplatesService {
  constructor(
    // Dependencies here
    private readonly templatesRepository: TemplatesRepository,
  ) {}

  
  async create(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createTemplatesDto: CreateTemplatesDto
  ) {
    // Do not remove comment below.
    // <creating-property />

    return this.templatesRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.templatesRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Templates['id']) {
    return this.templatesRepository.findById(id);
  }

  findByIds(ids: Templates['id'][]) {
    return this.templatesRepository.findByIds(ids);
  }

  async update(
    id: Templates['id'],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateTemplatesDto: UpdateTemplatesDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.templatesRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
    });
  }

  remove(id: Templates['id']) {
    return this.templatesRepository.remove(id);
  }
}
