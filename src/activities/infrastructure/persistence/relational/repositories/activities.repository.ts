import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ActivitiesEntity } from '../entities/activities.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Activities } from '../../../../domain/activities';
import { ActivitiesRepository } from '../../activities.repository';
import { activitiesMapper } from '../mappers/activities.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class activitiesRelationalRepository implements ActivitiesRepository {
  constructor(
    @InjectRepository(ActivitiesEntity)
    private readonly activitiesRepository: Repository<ActivitiesEntity>,
  ) {}

  async create(data: Activities): Promise<Activities> {
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
    }): Promise<Activities[]> {
    const entities = await this.activitiesRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => activitiesMapper.toDomain(entity));
  }

  async findById(id: Activities['id']): Promise<NullableType<Activities>> {
    const entity = await this.activitiesRepository.findOne({
      where: { id },
    });

    return entity ? activitiesMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Activities['id'][]): Promise<Activities[]> {
    const entities = await this.activitiesRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => activitiesMapper.toDomain(entity));
  }

  async update(
    id: Activities['id'],
    payload: Partial<Activities>,
  ): Promise<Activities> {
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

  async remove(id: Activities['id']): Promise<void> {
    await this.activitiesRepository.delete(id);
  }
}
