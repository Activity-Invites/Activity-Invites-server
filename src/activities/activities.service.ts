import { ThemesService } from '../themes/themes.service';
import { themes } from '../themes/domain/themes';

import { HttpStatus, UnprocessableEntityException } from '@nestjs/common';

import { Injectable } from '@nestjs/common';
import { CreateactivitiesDto } from './dto/create-activities.dto';
import { UpdateactivitiesDto } from './dto/update-activities.dto';
import { activitiesRepository } from './infrastructure/persistence/activities.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { activities } from './domain/activities';

@Injectable()
export class ActivitiesService {
  constructor(
    private readonly themesService: ThemesService,

    // Dependencies here
    private readonly activitiesRepository: activitiesRepository,
  ) {}

  async create(createactivitiesDto: CreateactivitiesDto) {
    // Do not remove comment below.
    // <creating-property />
    const themeIdObject = await this.themesService.findById(
      createactivitiesDto.themeId.id,
    );
    if (!themeIdObject) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          themeId: 'notExists',
        },
      });
    }
    const themeId = themeIdObject;

    return this.activitiesRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      themeId,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.activitiesRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: activities['id']) {
    return this.activitiesRepository.findById(id);
  }

  findByIds(ids: activities['id'][]) {
    return this.activitiesRepository.findByIds(ids);
  }

  async update(
    id: activities['id'],

    updateactivitiesDto: UpdateactivitiesDto,
  ) {
    // Do not remove comment below.
    // <updating-property />
    let themeId: themes | undefined = undefined;

    if (updateactivitiesDto.themeId) {
      const themeIdObject = await this.themesService.findById(
        updateactivitiesDto.themeId.id,
      );
      if (!themeIdObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            themeId: 'notExists',
          },
        });
      }
      themeId = themeIdObject;
    }

    return this.activitiesRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      themeId,
    });
  }

  remove(id: activities['id']) {
    return this.activitiesRepository.remove(id);
  }
}
