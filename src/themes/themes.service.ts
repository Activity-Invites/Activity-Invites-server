import { Injectable } from '@nestjs/common';
import { CreatethemesDto } from './dto/create-themes.dto';
import { UpdatethemesDto } from './dto/update-themes.dto';
import { themesRepository } from './infrastructure/persistence/themes.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { themes } from './domain/themes';

@Injectable()
export class themesService {
  constructor(
    // Dependencies here
    private readonly themesRepository: themesRepository,
  ) {}

  async create(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createthemesDto: CreatethemesDto,
  ) {
    // Do not remove comment below.
    // <creating-property />

    return this.themesRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.themesRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: themes['id']) {
    return this.themesRepository.findById(id);
  }

  findByIds(ids: themes['id'][]) {
    return this.themesRepository.findByIds(ids);
  }

  async update(
    id: themes['id'],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updatethemesDto: UpdatethemesDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.themesRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
    });
  }

  remove(id: themes['id']) {
    return this.themesRepository.remove(id);
  }
}
