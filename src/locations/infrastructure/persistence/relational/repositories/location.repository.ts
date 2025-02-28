import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { LocationEntity } from '../entities/location.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Location } from '../../../../domain/location';
import { LocationRepository } from '../../location.repository';
import { LocationMapper } from '../mappers/location.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class LocationRelationalRepository implements LocationRepository {
  constructor(
    @InjectRepository(LocationEntity)
    private readonly locationRepository: Repository<LocationEntity>,
  ) {}

  async create(data: Location): Promise<Location> {
    const persistenceModel = LocationMapper.toPersistence(data);
    const newEntity = await this.locationRepository.save(
      this.locationRepository.create(persistenceModel),
    );
    return LocationMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Location[]> {
    const entities = await this.locationRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => LocationMapper.toDomain(entity));
  }

  async findById(id: Location['id']): Promise<NullableType<Location>> {
    const entity = await this.locationRepository.findOne({
      where: { id },
    });

    return entity ? LocationMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Location['id'][]): Promise<Location[]> {
    const entities = await this.locationRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => LocationMapper.toDomain(entity));
  }

  async update(
    id: Location['id'],
    payload: Partial<Location>,
  ): Promise<Location> {
    const entity = await this.locationRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.locationRepository.save(
      this.locationRepository.create(
        LocationMapper.toPersistence({
          ...LocationMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return LocationMapper.toDomain(updatedEntity);
  }

  async remove(id: Location['id']): Promise<void> {
    await this.locationRepository.delete(id);
  }
}
