import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NullableType } from '@/utils/types/nullable.type';
import { Activity, ActivityStatus, ActivityType } from '@/activities/domain/activity';
import { ActivityEntity } from '../entities/activity.entity';
import { ActivityMapper } from '../mappers/activity.mapper';
import { ActivityRepository } from '../../activity.repository';
import { FilterActivityDto, SortActivityDto } from '@/activities/dto/query-activity.dto';
import { IPaginationOptions } from '@/utils/types/pagination-options';

@Injectable()
export class RelationalActivityRepository implements ActivityRepository {
  constructor(
    @InjectRepository(ActivityEntity)
    private readonly activityRepository: Repository<ActivityEntity>,
  ) {}

  async create(activity: Activity): Promise<Activity> {
    const persistenceEntity = ActivityMapper.toPersistence(activity);
    const savedEntity = await this.activityRepository.save(persistenceEntity);
    return ActivityMapper.toDomain(savedEntity);
  }

  async findOne(id: string): Promise<NullableType<Activity>> {
    const entity = await this.activityRepository.findOne({
      where: { id },
      relations: ['creator', 'theme', 'tickets', 'comments'],
    });

    return entity ? ActivityMapper.toDomain(entity) : null;
  }

  async findManyWithPagination(params: {
    filterOptions?: FilterActivityDto | null;
    sortOptions?: SortActivityDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Activity[]> {
    const { filterOptions, sortOptions, paginationOptions } = params;
    const queryBuilder = this.activityRepository.createQueryBuilder('activity');

    // 添加关联
    queryBuilder
      .leftJoinAndSelect('activity.creator', 'creator')
      .leftJoinAndSelect('activity.theme', 'theme')
      .leftJoinAndSelect('activity.tickets', 'tickets')
      .leftJoinAndSelect('activity.comments', 'comments');

    // 应用过滤条件
    if (filterOptions) {
      if (filterOptions.status) {
        queryBuilder.andWhere('activity.status = :status', {
          status: filterOptions.status,
        });
      }
      if (filterOptions.type) {
        queryBuilder.andWhere('activity.type = :type', {
          type: filterOptions.type,
        });
      }
      if (filterOptions.creatorId) {
        queryBuilder.andWhere('activity.creator.id = :creatorId', {
          creatorId: filterOptions.creatorId,
        });
      }
      if (filterOptions.themeId) {
        queryBuilder.andWhere('activity.theme.id = :themeId', {
          themeId: filterOptions.themeId,
        });
      }
      if (filterOptions.isPublic !== undefined) {
        queryBuilder.andWhere('activity.isPublic = :isPublic', {
          isPublic: filterOptions.isPublic,
        });
      }
      if (filterOptions.location) {
        queryBuilder.andWhere('activity.location = :location', {
          location: filterOptions.location,
        });
      }
      if (filterOptions.startTime) {
        queryBuilder.andWhere('activity.startTime >= :startTime', {
          startTime: filterOptions.startTime,
        });
      }
      if (filterOptions.endTime) {
        queryBuilder.andWhere('activity.endTime <= :endTime', {
          endTime: filterOptions.endTime,
        });
      }
    }

    // 应用排序条件
    if (sortOptions && sortOptions.length > 0) {
      sortOptions.forEach((sort, index) => {
        const { orderBy, order } = sort;
        if (index === 0) {
          queryBuilder.orderBy(`activity.${orderBy}`, order);
        } else {
          queryBuilder.addOrderBy(`activity.${orderBy}`, order);
        }
      });
    } else {
      queryBuilder.orderBy('activity.createdAt', 'DESC');
    }

    // 应用分页
    const { page, limit } = paginationOptions;
    queryBuilder.skip((page - 1) * limit).take(limit);

    const entities = await queryBuilder.getMany();
    return entities.map((entity) => ActivityMapper.toDomain(entity));
  }

  async update(id: string, payload: Partial<Omit<Activity, 'id'>>): Promise<Activity> {
    const entity = await this.activityRepository.findOne({ where: { id } });
    if (!entity) {
      throw new Error(`Activity with id ${id} not found`);
    }

    const updatedEntity = await this.activityRepository.save({
      ...entity,
      ...ActivityMapper.toPersistence({ ...payload, id } as Activity),
    });

    return ActivityMapper.toDomain(updatedEntity);
  }

  async softDelete(id: string): Promise<void> {
    await this.activityRepository.softDelete(id);
  }

  async softRemove(entity: Activity): Promise<void> {
    const persistenceEntity = ActivityMapper.toPersistence(entity);
    await this.activityRepository.softRemove(persistenceEntity);
  }

  async recover(id: string): Promise<void> {
    await this.activityRepository.recover({id});
  }

  async findByCreatorId(creatorId: string): Promise<Activity[]> {
    const entities = await this.activityRepository
      .createQueryBuilder('activity')
      .leftJoinAndSelect('activity.creator', 'creator')
      .leftJoinAndSelect('activity.theme', 'theme')
      .leftJoinAndSelect('activity.tickets', 'tickets')
      .leftJoinAndSelect('activity.comments', 'comments')
      .where('creator.id = :creatorId', { creatorId })
      .getMany();
    return entities.map((entity) => ActivityMapper.toDomain(entity));
  }

  async findByThemeId(themeId: string): Promise<Activity[]> {
    const entities = await this.activityRepository
      .createQueryBuilder('activity')
      .leftJoinAndSelect('activity.creator', 'creator')
      .leftJoinAndSelect('activity.theme', 'theme')
      .leftJoinAndSelect('activity.tickets', 'tickets')
      .leftJoinAndSelect('activity.comments', 'comments')
      .where('theme.id = :themeId', { themeId })
      .getMany();
    return entities.map((entity) => ActivityMapper.toDomain(entity));
  }

  async findByStatus(status: ActivityStatus): Promise<Activity[]> {
    const entities = await this.activityRepository
      .createQueryBuilder('activity')
      .leftJoinAndSelect('activity.creator', 'creator')
      .leftJoinAndSelect('activity.theme', 'theme')
      .leftJoinAndSelect('activity.tickets', 'tickets')
      .leftJoinAndSelect('activity.comments', 'comments')
      .where('activity.status = :status', { status })
      .getMany();
    return entities.map((entity) => ActivityMapper.toDomain(entity));
  }

  async findByType(type: ActivityType): Promise<Activity[]> {
    const entities = await this.activityRepository
      .createQueryBuilder('activity')
      .leftJoinAndSelect('activity.creator', 'creator')
      .leftJoinAndSelect('activity.theme', 'theme')
      .leftJoinAndSelect('activity.tickets', 'tickets')
      .leftJoinAndSelect('activity.comments', 'comments')
      .where('activity.type = :type', { type })
      .getMany();
    return entities.map((entity) => ActivityMapper.toDomain(entity));
  }

  async findByTimeRange(startTime: Date, endTime: Date): Promise<Activity[]> {
    const entities = await this.activityRepository
      .createQueryBuilder('activity')
      .leftJoinAndSelect('activity.creator', 'creator')
      .leftJoinAndSelect('activity.theme', 'theme')
      .leftJoinAndSelect('activity.tickets', 'tickets')
      .leftJoinAndSelect('activity.comments', 'comments')
      .where('activity.startTime >= :startTime', { startTime })
      .andWhere('activity.endTime <= :endTime', { endTime })
      .getMany();
    return entities.map((entity) => ActivityMapper.toDomain(entity));
  }

  async findByLocation(location: string): Promise<Activity[]> {
    const entities = await this.activityRepository
      .createQueryBuilder('activity')
      .leftJoinAndSelect('activity.creator', 'creator')
      .leftJoinAndSelect('activity.theme', 'theme')
      .leftJoinAndSelect('activity.tickets', 'tickets')
      .leftJoinAndSelect('activity.comments', 'comments')
      .where('activity.location = :location', { location })
      .getMany();
    return entities.map((entity) => ActivityMapper.toDomain(entity));
  }

  async findPublicActivities(): Promise<Activity[]> {
    const entities = await this.activityRepository
      .createQueryBuilder('activity')
      .leftJoinAndSelect('activity.creator', 'creator')
      .leftJoinAndSelect('activity.theme', 'theme')
      .leftJoinAndSelect('activity.tickets', 'tickets')
      .leftJoinAndSelect('activity.comments', 'comments')
      .where('activity.isPublic = :isPublic', { isPublic: true })
      .getMany();
    return entities.map((entity) => ActivityMapper.toDomain(entity));
  }

  async findActiveActivities(): Promise<Activity[]> {
    const entities = await this.activityRepository
      .createQueryBuilder('activity')
      .leftJoinAndSelect('activity.creator', 'creator')
      .leftJoinAndSelect('activity.theme', 'theme')
      .leftJoinAndSelect('activity.tickets', 'tickets')
      .leftJoinAndSelect('activity.comments', 'comments')
      .where('activity.status = :status', { status: ActivityStatus.PUBLISHED })
      .getMany();
    return entities.map((entity) => ActivityMapper.toDomain(entity));
  }

  async findDeletedActivities(): Promise<Activity[]> {
    const entities = await this.activityRepository
      .createQueryBuilder('activity')
      .withDeleted()
      .leftJoinAndSelect('activity.creator', 'creator')
      .leftJoinAndSelect('activity.theme', 'theme')
      .leftJoinAndSelect('activity.tickets', 'tickets')
      .leftJoinAndSelect('activity.comments', 'comments')
      .where('activity.deletedAt IS NOT NULL')
      .getMany();
    return entities.map((entity) => ActivityMapper.toDomain(entity));
  }

  async restore(id: string): Promise<void> {
    await this.activityRepository.restore(id);
  }

  async hardDelete(id: string): Promise<void> {
    await this.activityRepository.delete(id);
  }
}
