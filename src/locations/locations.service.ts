import { Injectable } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { LocationRepository } from './infrastructure/persistence/location.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Location } from './domain/location';

@Injectable()
export class LocationsService {
  constructor(
    // Dependencies here
    private readonly locationRepository: LocationRepository,
  ) {}

  
  async create(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createLocationDto: CreateLocationDto
  ) {
    // Do not remove comment below.
    // <creating-property />

    return this.locationRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.locationRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Location['id']) {
    return this.locationRepository.findById(id);
  }

  findByIds(ids: Location['id'][]) {
    return this.locationRepository.findByIds(ids);
  }

  async update(
    id: Location['id'],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateLocationDto: UpdateLocationDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.locationRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
    });
  }

  remove(id: Location['id']) {
    return this.locationRepository.remove(id);
  }
}
