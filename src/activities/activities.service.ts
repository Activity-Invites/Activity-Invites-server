







import { ThemesService } from '../themes/themes.service';
import { Themes } from '../themes/domain/themes';

import { HttpStatus, UnprocessableEntityException } from '@nestjs/common';

import { Injectable } from '@nestjs/common';
import { CreateActivitiesDto } from './dto/create-activities.dto';
import { UpdateActivitiesDto } from './dto/update-activities.dto';
import { ActivitiesRepository } from './infrastructure/persistence/activities.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Activities } from './domain/activities';

@Injectable()
export class ActivitiesService {
  constructor(




    private readonly themesService: ThemesService,

    // Dependencies here
    private readonly activitiesRepository: ActivitiesRepository,
  ) { }

  async create(createActivitiesDto: CreateActivitiesDto) {
    // Do not remove comment below.
    // <creating-property />




    const themeIdObject = await this.themesService.findById(
      createActivitiesDto.themeId.id,
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
      endTime: createActivitiesDto.endTime,

      startTime: createActivitiesDto.startTime,

      mainImage: createActivitiesDto.mainImage,

      name: createActivitiesDto.name,

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

  findById(id: Activities['id']) {
    return this.activitiesRepository.findById(id);
  }

  findByIds(ids: Activities['id'][]) {
    return this.activitiesRepository.findByIds(ids);
  }

  async update(
    id: Activities['id'],

    updateActivitiesDto: UpdateActivitiesDto,
  ) {
    // Do not remove comment below.
    // <updating-property />




    let themeId: Themes | undefined = undefined;

    if (updateActivitiesDto.themeId) {
      const themeIdObject = await this.themesService.findById(
        updateActivitiesDto.themeId.id,
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
      endTime: updateActivitiesDto.endTime,

      startTime: updateActivitiesDto.startTime,

      mainImage: updateActivitiesDto.mainImage,

      name: updateActivitiesDto.name,

      themeId,
    });
  }

  remove(id: Activities['id']) {
    return this.activitiesRepository.remove(id);
  }
}
