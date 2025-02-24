import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityRepository } from '../../activity.repository';
import { Activity } from '@/activities/domain/activities';
import { ActivityEntity } from '../entities/activity.entity';
import { ActivityMapper } from '../mappers/activity.mapper';
import { NullableType } from '@/utils/types/nullable.type';

@Injectable()
export class RelationalActivityRepository implements ActivityRepository {
  constructor(
    @InjectRepository(ActivityEntity)
    private readonly repository: Repository<ActivityEntity>,
  ) {}

  async create(data: Activity): Promise<Activity> {
    const persistenceModel = ActivityMapper.toPersistence(data);
    const newEntity = await this.repository.save(
      this.repository.create(persistenceModel),
    );
    return ActivityMapper.toDomain(newEntity);
  }

  async findById(id: string): Promise<NullableType<Activity>> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['creator', 'theme'],
    });
    return entity ? ActivityMapper.toDomain(entity) : null;
  }

  async findAll(): Promise<Activity[]> {
    const entities = await this.repository.find({
      relations: ['creator', 'theme'],
    });
    return entities.map(ActivityMapper.toDomain);
  }

  async update(id: Activity['id'], payload: Partial<Activity>): Promise<Activity> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['creator', 'theme'],
    });

    if (!entity) {
      throw new Error('Activity not found');
    }
    const updatedEntity = await this.repository.save(
      this.repository.create(
        ActivityMapper.toPersistence({
          ...ActivityMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );
    return ActivityMapper.toDomain(updatedEntity);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async findByCreatorId(creatorId: string): Promise<Activity[]> {
    if (!creatorId) return [];
    const entities = await this.repository.find({
      where: {
        creator: { id: parseInt(creatorId) },
      },
      relations: ['creator', 'theme'],
    });
    return entities.map(ActivityMapper.toDomain);
  }

  async findByThemeId(themeId: string): Promise<Activity[]> {
    if (!themeId) return [];
    const entities = await this.repository.find({
      where: { theme: { id: themeId } },
      relations: ['creator', 'theme'],
    });
    return entities.map(ActivityMapper.toDomain);
  }
}
