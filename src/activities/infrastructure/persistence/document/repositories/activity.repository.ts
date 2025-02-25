import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NullableType } from '@/utils/types/nullable.type';
import { Activity, ActivityStatus, ActivityType } from '@/activities/domain/activity';
import { ActivityDocument } from '../entities/activity.schema';
import { ActivityDocumentMapper } from '../mappers/activity.mapper';
import { ActivityRepository } from '../../activity.repository';
import { FilterActivityDto, SortActivityDto } from '@/activities/dto/query-activity.dto';
import { IPaginationOptions } from '@/utils/types/pagination-options';
import { User } from '@/users/domain/user';

@Injectable()
export class DocumentActivityRepository implements ActivityRepository {
  constructor(
    @InjectModel(ActivityDocument.name)
    private readonly activityModel: Model<ActivityDocument>,
  ) {}

  async create(activity: Activity): Promise<Activity> {
    const persistenceModel = ActivityDocumentMapper.toPersistence(activity);
    const createdActivity = await this.activityModel.create(persistenceModel);
    const populatedActivity = await createdActivity.populate([
      'creator',
      'theme',
      'tickets',
      'comments',
    ]);
    return ActivityDocumentMapper.toDomain(populatedActivity);
  }

  async findOne(id: string): Promise<NullableType<Activity>> {
    const document = await this.activityModel
      .findById(id)
      .populate(['creator', 'theme', 'tickets', 'comments']);
    return document ? ActivityDocumentMapper.toDomain(document) : null;
  }

  async findManyWithPagination(params: {
    filterOptions?: FilterActivityDto | null;
    sortOptions?: SortActivityDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Activity[]> {
    const { filterOptions, sortOptions, paginationOptions } = params;
    const query = this.activityModel.find();

    // 应用过滤条件
    if (filterOptions) {
      if (filterOptions.status) {
        query.where('status', filterOptions.status);
      }
      if (filterOptions.type) {
        query.where('type', filterOptions.type);
      }
      if (filterOptions.creatorId) {
        query.where('creator', filterOptions.creatorId);
      }
      if (filterOptions.themeId) {
        query.where('theme', filterOptions.themeId);
      }
      if (filterOptions.isPublic !== undefined) {
        query.where('isPublic', filterOptions.isPublic);
      }
      if (filterOptions.location) {
        query.where('location', filterOptions.location);
      }
      if (filterOptions.startTime) {
        query.where('startTime').gte(filterOptions.startTime.getTime());
      }
      if (filterOptions.endTime) {
        query.where('endTime').lte(filterOptions.endTime.getTime());
      }
    }

    // 应用排序条件
    if (sortOptions && sortOptions.length > 0) {
      const sort: Record<string, 1 | -1> = {};
      sortOptions.forEach((sortOption) => {
        sort[sortOption.orderBy] = sortOption.order === 'ASC' ? 1 : -1;
      });
      query.sort(sort);
    } else {
      query.sort({ createdAt: -1 });
    }

    // 应用分页
    const skip = (paginationOptions.page - 1) * paginationOptions.limit;
    const limit = paginationOptions.limit;
    query.skip(skip).limit(limit);

    // 填充关联字段
    query.populate(['creator', 'theme', 'tickets', 'comments']);

    const documents = await query.exec();
    return documents.map((doc) => ActivityDocumentMapper.toDomain(doc));
  }

  async update(id: string, payload: Partial<Omit<Activity, 'id'>>): Promise<Activity> {
    const persistenceModel = ActivityDocumentMapper.toPersistence({ ...payload, id } as Activity);
    const updatedActivity = await this.activityModel
      .findByIdAndUpdate(id, persistenceModel, { new: true })
      .populate(['creator', 'theme', 'tickets', 'comments']);

    if (!updatedActivity) {
      throw new Error(`Activity with id ${id} not found`);
    }

    return ActivityDocumentMapper.toDomain(updatedActivity);
  }

  async softRemove(entity: Activity): Promise<void> {
    await this.activityModel.findByIdAndUpdate(entity.id, {
      deletedAt: new Date(),
    });
  }

  async recover(id: string): Promise<void> {
    await this.activityModel.findByIdAndUpdate(id, {
      $unset: { deletedAt: 1 },
    });
  }

  async findByCreatorId(creatorId: string): Promise<Activity[]> {
    const documents = await this.activityModel
      .find({ creator: creatorId })
      .populate(['creator', 'theme', 'tickets', 'comments']);
    return documents.map((doc) => ActivityDocumentMapper.toDomain(doc));
  }

  async findByThemeId(themeId: string): Promise<Activity[]> {
    const documents = await this.activityModel
      .find({ theme: themeId })
      .populate(['creator', 'theme', 'tickets', 'comments']);
    return documents.map((doc) => ActivityDocumentMapper.toDomain(doc));
  }

  async findByStatus(status: ActivityStatus): Promise<Activity[]> {
    const documents = await this.activityModel
      .find({ status })
      .populate(['creator', 'theme', 'tickets', 'comments']);
    return documents.map((doc) => ActivityDocumentMapper.toDomain(doc));
  }

  async findByType(type: ActivityType): Promise<Activity[]> {
    const documents = await this.activityModel
      .find({ type })
      .populate(['creator', 'theme', 'tickets', 'comments']);
    return documents.map((doc) => ActivityDocumentMapper.toDomain(doc));
  }

  async findByTimeRange(startTime: Date, endTime: Date): Promise<Activity[]> {
    const documents = await this.activityModel
      .find({
        startTime: { $gte: startTime.getTime() },
        endTime: { $lte: endTime.getTime() },
      })
      .populate(['creator', 'theme', 'tickets', 'comments']);
    return documents.map((doc) => ActivityDocumentMapper.toDomain(doc));
  }

  async findByLocation(location: string): Promise<Activity[]> {
    const documents = await this.activityModel
      .find({ location })
      .populate(['creator', 'theme', 'tickets', 'comments']);
    return documents.map((doc) => ActivityDocumentMapper.toDomain(doc));
  }

  async findPublicActivities(): Promise<Activity[]> {
    const documents = await this.activityModel
      .find({ isPublic: true })
      .populate(['creator', 'theme', 'tickets', 'comments']);
    return documents.map((doc) => ActivityDocumentMapper.toDomain(doc));
  }

  async findActiveActivities(): Promise<Activity[]> {
    const documents = await this.activityModel
      .find({ status: ActivityStatus.PUBLISHED })
      .populate(['creator', 'theme', 'tickets', 'comments']);
    return documents.map((doc) => ActivityDocumentMapper.toDomain(doc));
  }

  async findDeletedActivities(): Promise<Activity[]> {
    const documents = await this.activityModel
      .find({ deletedAt: { $ne: null } })
      .populate(['creator', 'theme', 'tickets', 'comments']);
    return documents.map((doc) => ActivityDocumentMapper.toDomain(doc));
  }

  async restore(id: string): Promise<void> {
    await this.activityModel.findByIdAndUpdate(id, {
      $unset: { deletedAt: 1 },
    });
  }

  async softDelete(id: string): Promise<void> {
    await this.activityModel.findByIdAndUpdate(id, {
      deletedAt: new Date(),
    });
  }

  async hardDelete(id: string): Promise<void> {
    await this.activityModel.findByIdAndDelete(id);
  }

  async delete(id: string): Promise<void> {
    await this.activityModel.findByIdAndUpdate(id, {
      deletedAt: new Date(),
    });
  }

  async join(id: string, user: User): Promise<void> {
    await this.activityModel.findByIdAndUpdate(id, {
      $addToSet: { participants: user.id },
    });
  }

  async leave(id: string, user: User): Promise<void> {
    await this.activityModel.findByIdAndUpdate(id, {
      $pull: { participants: user.id },
    });
  }

  async findAll(options: {
    isPublic?: boolean;
    status?: ActivityStatus;
    creatorId?: string;
  }): Promise<Activity[]> {
    const query: any = {};

    if (options.isPublic !== undefined) {
      query.isPublic = options.isPublic;
    }
    if (options.status) {
      query.status = options.status;
    }
    if (options.creatorId) {
      query['creator'] = options.creatorId;
    }

    const activities = await this.activityModel
      .find(query)
      .populate(['creator', 'theme', 'tickets', 'comments'])
      .exec();

    return activities.map(activity => ActivityDocumentMapper.toDomain(activity));
  }
}
