import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity, ActivityStatus } from './domain/activities';
import { CreateActivityDto } from './dto/create-activity.dto';
import { User } from '@/users/domain/user';
import { QRCodeService } from '../utils/qrcode.service';
import { CustomLoggerService } from '@/shared/logger/logger.service';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Activity)
    private readonly activitiesRepository: Repository<Activity>,
    private readonly qrCodeService: QRCodeService,
    private readonly logger: CustomLoggerService,
  ) {}

  async create(
    createActivityDto: CreateActivityDto,
    creator: User,
  ): Promise<Activity> {
    try {
      const activity = this.activitiesRepository.create({
        ...createActivityDto,
        creator,
        status: ActivityStatus.DRAFT,
      });

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

      const savedActivity = await this.activitiesRepository.save(activity);
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
      throw error; // 重新抛出错误，让全局异常过滤器处理
    }
  }

  async findAll(options: {
    isPublic?: boolean;
    status?: ActivityStatus;
    creatorId?: string;
  }): Promise<Activity[]> {
    try {
      return this.activitiesRepository.find({
        where: options,
        relations: ['creator', 'theme'],
      });
    } catch (error) {
      this.logger.error(
        '获取活动列表失败',
        error.stack,
        'ActivitiesService.findAll',
      );
      throw error; // 重新抛出错误，让全局异常过滤器处理
    }
  }

  async findOne(id: string): Promise<Activity> {
    try {
      const activity = await this.activitiesRepository.findOne({
        where: { id },
        relations: ['creator', 'theme', 'tickets', 'comments'],
      });

      if (!activity) {
        throw new NotFoundException('Activity not found');
      }

      return activity;
    } catch (error) {
      this.logger.error(
        '获取活动详情失败',
        error.stack,
        'ActivitiesService.findOne',
      );
      throw error; // 重新抛出错误，让全局异常过滤器处理
    }
  }

  async publish(id: string, user: User): Promise<Activity> {
    try {
      const activity = await this.findOne(id);

      if (activity.creator.id !== user.id) {
        throw new ForbiddenException('Only creator can publish activity');
      }

      if (activity.status !== ActivityStatus.DRAFT) {
        throw new BadRequestException('Only draft activities can be published');
      }

      activity.status = ActivityStatus.PUBLISHED;
      const savedActivity = await this.activitiesRepository.save(activity);
      this.logger.log(
        `活动发布成功: ${savedActivity.id}`,
        'ActivitiesService.publish',
      );
      return savedActivity;
    } catch (error) {
      this.logger.error(
        '发布活动失败',
        error.stack,
        'ActivitiesService.publish',
      );
      throw error; // 重新抛出错误，让全局异常过滤器处理
    }
  }

  async generateInviteQRCode(id: string, user: User): Promise<string> {
    try {
      const activity = await this.findOne(id);

      if (activity.creator.id !== user.id) {
        throw new ForbiddenException('Only creator can generate invite QR code');
      }

      // Generate a unique invite token
      const inviteToken = `${activity.id}-${Date.now()}`;

      // Generate QR code with the invite URL
      const qrCodeData = await this.qrCodeService.generate(
        `${process.env.APP_URL}/activities/join/${inviteToken}`,
      );

      return qrCodeData;
    } catch (error) {
      this.logger.error(
        '生成邀请二维码失败',
        error.stack,
        'ActivitiesService.generateInviteQRCode',
      );
      throw error; // 重新抛出错误，让全局异常过滤器处理
    }
  }

  async join(id: string, user: User): Promise<Activity> {
    try {
      const activity = await this.findOne(id);

      if (activity.status !== ActivityStatus.PUBLISHED) {
        throw new BadRequestException('Activity is not open for registration');
      }

      if (activity.currentParticipants >= activity.maxParticipants) {
        throw new BadRequestException('Activity is full');
      }

      // TODO: Add participant to activity
      activity.currentParticipants += 1;

      const savedActivity = await this.activitiesRepository.save(activity);
      this.logger.log(
        `用户加入活动成功: ${savedActivity.id}`,
        'ActivitiesService.join',
      );
      return savedActivity;
    } catch (error) {
      this.logger.error(
        '加入活动失败',
        error.stack,
        'ActivitiesService.join',
      );
      throw error; // 重新抛出错误，让全局异常过滤器处理
    }
  }

  async cancel(id: string, user: User): Promise<Activity> {
    try {
      const activity = await this.findOne(id);

      if (activity.creator.id !== user.id) {
        throw new ForbiddenException('Only creator can cancel activity');
      }

      if (activity.status === ActivityStatus.ENDED) {
        throw new BadRequestException('Cannot cancel ended activity');
      }

      activity.status = ActivityStatus.CANCELLED;
      const savedActivity = await this.activitiesRepository.save(activity);
      this.logger.log(
        `活动取消成功: ${savedActivity.id}`,
        'ActivitiesService.cancel',
      );
      return savedActivity;
    } catch (error) {
      this.logger.error(
        '取消活动失败',
        error.stack,
        'ActivitiesService.cancel',
      );
      throw error; // 重新抛出错误，让全局异常过滤器处理
    }
  }
}
