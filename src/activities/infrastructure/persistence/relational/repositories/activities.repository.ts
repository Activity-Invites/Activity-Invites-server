import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { activitiesEntity } from '../entities/activities.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { activities } from '../../../../domain/activities';
import { activitiesRepository } from '../../activities.repository';
import { activitiesMapper } from '../mappers/activities.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class activitiesRelationalRepository implements activitiesRepository {
  constructor(
    @InjectRepository(activitiesEntity)
    private readonly activitiesRepository: Repository<activitiesEntity>,
  ) {}

  async create(data: activities): Promise<activities> {
    const persistenceModel = activitiesMapper.toPersistence(data);
    const newEntity = await this.activitiesRepository.save(
      this.activitiesRepository.create(persistenceModel),
    );
    return activitiesMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<activities[]> {
    const entities = await this.activitiesRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => activitiesMapper.toDomain(entity));
  }

  async findById(id: activities['id']): Promise<NullableType<activities>> {
    const entity = await this.activitiesRepository.findOne({
      where: { id },
    });

    return entity ? activitiesMapper.toDomain(entity) : null;
  }

  async findByIds(ids: activities['id'][]): Promise<activities[]> {
    const entities = await this.activitiesRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => activitiesMapper.toDomain(entity));
  }

  async update(
    id: activities['id'],
    payload: Partial<activities>,
  ): Promise<activities> {
    const entity = await this.activitiesRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.activitiesRepository.save(
      this.activitiesRepository.create(
        activitiesMapper.toPersistence({
          ...activitiesMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return activitiesMapper.toDomain(updatedEntity);
  }

  async remove(id: activities['id']): Promise<void> {
    await this.activitiesRepository.delete(id);
  }
}
