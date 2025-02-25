import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { Activity, ActivityStatus, ActivityType } from './domain/activity';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { User } from '@/users/domain/user';
import { QRCodeService } from '@/utils/qrcode.service';
import { CustomLoggerService } from '@/shared/logger/logger.service';
import { ActivityRepository } from './infrastructure/persistence/activity.repository';

@Injectable()
export class ActivitiesService {
  constructor(
    private readonly activityRepository: ActivityRepository,
    private readonly qrCodeService: QRCodeService,
    private readonly logger: CustomLoggerService,
  ) {}

  /**
   * 创建活动
   * @param createActivityDto 创建活动DTO
   * @param creator 创建者
   */
  async create(
    createActivityDto: CreateActivityDto,
    creator: User,
  ): Promise<Activity> {
    try {
      const activity = {
        ...createActivityDto,
        creator,
        status: ActivityStatus.DRAFT,
      } as Activity;

      // 生成二维码
      try {
        const qrCodeUrl = await this.qrCodeService.generate(
          `activity/${activity.id}`,
        );
        // activity.qrCodeUrl = qrCodeUrl;
      } catch (error) {
        this.logger.error(
          '生成活动二维码失败',
          error.stack,
          'ActivitiesService.create',
        );
        // 继续执行，因为二维码不是必需的
      }

      const savedActivity = await this.activityRepository.create(activity);
      this.logger.log(
        `活动创建成功: ${savedActivity.id}`,
        'ActivitiesService.create',
      );
      return savedActivity;
    } catch (error) {
      this.logger.error(
        '创建活动失败',
        error.stack,
        'ActivitiesService.create',
      );
      throw error;
    }
  }

  /**
   * 更新活动
   * @param id 活动ID
   * @param updateActivityDto 更新活动DTO
   * @param user 当前用户
   */
  async update(
    id: string,
    updateActivityDto: UpdateActivityDto,
    user: User,
  ): Promise<Activity> {
    const activity = await this.activityRepository.findOne(id);
    if (!activity) {
      throw new NotFoundException('活动不存在');
    }

    if (activity.creator.id !== user.id) {
      throw new ForbiddenException('无权限修改此活动');
    }

    return this.activityRepository.update(id, updateActivityDto);
  }

  /**
   * 删除活动
   * @param id 活动ID
   * @param user 当前用户
   */
  async delete(id: string, user: User): Promise<void> {
    const activity = await this.activityRepository.findOne(id);
    if (!activity) {
      throw new NotFoundException('活动不存在');
    }

    if (activity.creator.id !== user.id) {
      throw new ForbiddenException('无权限删除此活动');
    }

    await this.activityRepository.softDelete(id);
  }

  /**
   * 恢复已删除的活动
   * @param id 活动ID
   * @param user 当前用户
   */
  async restore(id: string, user: User): Promise<void> {
    const activity = await this.activityRepository.findOne(id);
    if (!activity) {
      throw new NotFoundException('活动不存在');
    }

    if (activity.creator.id !== user.id) {
      throw new ForbiddenException('无权限恢复此活动');
    }

    await this.activityRepository.restore(id);
  }

  /**
   * 永久删除活动
   * @param id 活动ID
   * @param user 当前用户
   */
  async hardDelete(id: string, user: User): Promise<void> {
    const activity = await this.activityRepository.findOne(id);
    if (!activity) {
      throw new NotFoundException('活动不存在');
    }

    if (activity.creator.id !== user.id) {
      throw new ForbiddenException('无权限永久删除此活动');
    }

    await this.activityRepository.hardDelete(id);
  }

  /**
   * 发布活动
   * @param id 活动ID
   * @param user 当前用户
   */
  async publish(id: string, user: User): Promise<Activity> {
    const activity = await this.activityRepository.findOne(id);
    if (!activity) {
      throw new NotFoundException('活动不存在');
    }

    if (activity.creator.id !== user.id) {
      throw new ForbiddenException('无权限发布此活动');
    }

    if (activity.status !== ActivityStatus.DRAFT) {
      throw new BadRequestException('只有草稿状态的活动可以发布');
    }

    return this.activityRepository.update(id, {
      status: ActivityStatus.PUBLISHED,
    });
  }

  /**
   * 取消活动
   * @param id 活动ID
   * @param user 当前用户
   */
  async cancel(id: string, user: User): Promise<Activity> {
    const activity = await this.activityRepository.findOne(id);
    if (!activity) {
      throw new NotFoundException('活动不存在');
    }

    if (activity.creator.id !== user.id) {
      throw new ForbiddenException('无权限取消此活动');
    }

    if (activity.status !== ActivityStatus.PUBLISHED) {
      throw new BadRequestException('只有已发布的活动可以取消');
    }

    return this.activityRepository.update(id, {
      status: ActivityStatus.CANCELLED,
    });
  }

  /**
   * 结束活动
   * @param id 活动ID
   * @param user 当前用户
   */
  async end(id: string, user: User): Promise<Activity> {
    const activity = await this.activityRepository.findOne(id);
    if (!activity) {
      throw new NotFoundException('活动不存在');
    }

    if (activity.creator.id !== user.id) {
      throw new ForbiddenException('无权限结束此活动');
    }

    if (activity.status !== ActivityStatus.IN_PROGRESS) {
      throw new BadRequestException('只有进行中的活动可以结束');
    }

    return this.activityRepository.update(id, {
      status: ActivityStatus.ENDED,
    });
  }

  /**
   * 查找用户创建的活动
   * @param userId 用户ID
   */
  async findByCreator(userId: string): Promise<Activity[]> {
    return this.activityRepository.findByCreatorId(userId);
  }

  /**
   * 查找主题相关的活动
   * @param themeId 主题ID
   */
  async findByTheme(themeId: string): Promise<Activity[]> {
    return this.activityRepository.findByThemeId(themeId);
  }

  /**
   * 查找指定状态的活动
   * @param status 活动状态
   */
  async findByStatus(status: ActivityStatus): Promise<Activity[]> {
    return this.activityRepository.findByStatus(status);
  }

  /**
   * 查找指定类型的活动
   * @param type 活动类型
   */
  async findByType(type: ActivityType): Promise<Activity[]> {
    return this.activityRepository.findByType(type);
  }

  /**
   * 查找时间范围内的活动
   * @param startTime 开始时间
   * @param endTime 结束时间
   */
  async findByTimeRange(startTime: Date, endTime: Date): Promise<Activity[]> {
    return this.activityRepository.findByTimeRange(startTime, endTime);
  }

  /**
   * 查找指定地点的活动
   * @param location 活动地点
   */
  async findByLocation(location: string): Promise<Activity[]> {
    return this.activityRepository.findByLocation(location);
  }

  /**
   * 查找公开的活动
   */
  async findPublicActivities(): Promise<Activity[]> {
    return this.activityRepository.findPublicActivities();
  }

  /**
   * 查找未删除的活动
   */
  async findActiveActivities(): Promise<Activity[]> {
    return this.activityRepository.findActiveActivities();
  }

  /**
   * 查找已删除的活动
   */
  async findDeletedActivities(): Promise<Activity[]> {
    return this.activityRepository.findDeletedActivities();
  }
}
