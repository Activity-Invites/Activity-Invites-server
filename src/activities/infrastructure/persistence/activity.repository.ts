import { NullableType } from '@/utils/types/nullable.type';
import { Activity, ActivityStatus, ActivityType } from '@/activities/domain/activity';
import { FilterActivityDto, SortActivityDto } from '@/activities/dto/query-activity.dto';
import { IPaginationOptions } from '@/utils/types/pagination-options';

export abstract class ActivityRepository {
  /**
   * 创建活动
   * @param activity 活动信息
   */
  abstract create(activity: Activity): Promise<Activity>;

  /**
   * 根据ID查找活动
   * @param id 活动ID
   */
  abstract findOne(id: string): Promise<NullableType<Activity>>;

  /**
   * 分页查找活动
   * @param params 分页参数
   */
  abstract findManyWithPagination(params: {
    filterOptions?: FilterActivityDto | null;
    sortOptions?: SortActivityDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Activity[]>;

  /**
   * 更新活动
   * @param id 活动ID
   * @param payload 要更新的活动信息
   */
  abstract update(id: string, payload: Partial<Omit<Activity, 'id'>>): Promise<Activity>;

  /**
   * 软删除活动
   * @param id 活动ID
   */
  abstract softDelete(id: string): Promise<void>;

  /**
   * 软删除活动
   * @param entity 活动实体
   */
  abstract softRemove(entity: Activity): Promise<void>;

  /**
   * 恢复已删除的活动
   * @param id 活动ID
   */
  abstract recover(id: string): Promise<void>;

  /**
   * 根据创建者ID查找活动
   * @param creatorId 创建者ID
   */
  abstract findByCreatorId(creatorId: string): Promise<Activity[]>;

  /**
   * 根据主题ID查找活动
   * @param themeId 主题ID
   */
  abstract findByThemeId(themeId: string): Promise<Activity[]>;

  /**
   * 根据状态查找活动
   * @param status 活动状态
   */
  abstract findByStatus(status: ActivityStatus): Promise<Activity[]>;

  /**
   * 根据类型查找活动
   * @param type 活动类型
   */
  abstract findByType(type: ActivityType): Promise<Activity[]>;

  /**
   * 根据时间范围查找活动
   * @param startTime 开始时间
   * @param endTime 结束时间
   */
  abstract findByTimeRange(startTime: Date, endTime: Date): Promise<Activity[]>;

  /**
   * 根据位置查找活动
   * @param location 活动地点
   */
  abstract findByLocation(location: string): Promise<Activity[]>;

  /**
   * 查找公开的活动
   */
  abstract findPublicActivities(): Promise<Activity[]>;

  /**
   * 查找未删除的活动
   */
  abstract findActiveActivities(): Promise<Activity[]>;

  /**
   * 查找已删除的活动
   */
  abstract findDeletedActivities(): Promise<Activity[]>;

  /**
   * 恢复已删除的活动
   * @param id 活动ID
   */
  abstract restore(id: string): Promise<void>;

  /**
   * 永久删除活动
   * @param id 活动ID
   */
  abstract hardDelete(id: string): Promise<void>;
}
