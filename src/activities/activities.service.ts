import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity, ActivityStatus } from './entities/activity.entity';
import { CreateActivityDto } from './dto/create-activity.dto';
import { User } from '../users/entities/user.entity';
import { QRCodeService } from '../utils/qrcode.service';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Activity)
    private readonly activitiesRepository: Repository<Activity>,
    private readonly qrCodeService: QRCodeService,
  ) {}

  async create(
    createActivityDto: CreateActivityDto,
    creator: User,
  ): Promise<Activity> {
    const activity = this.activitiesRepository.create({
      ...createActivityDto,
      creator,
      status: ActivityStatus.DRAFT,
    });

    return this.activitiesRepository.save(activity);
  }

  async findAll(options: {
    isPublic?: boolean;
    status?: ActivityStatus;
    creatorId?: string;
  }): Promise<Activity[]> {
    return this.activitiesRepository.find({
      where: options,
      relations: ['creator', 'theme'],
    });
  }

  async findOne(id: string): Promise<Activity> {
    const activity = await this.activitiesRepository.findOne({
      where: { id },
      relations: ['creator', 'theme', 'tickets', 'comments'],
    });

    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    return activity;
  }

  async publish(id: string, user: User): Promise<Activity> {
    const activity = await this.findOne(id);

    if (activity.creator.id !== user.id) {
      throw new ForbiddenException('Only creator can publish activity');
    }

    if (activity.status !== ActivityStatus.DRAFT) {
      throw new BadRequestException('Only draft activities can be published');
    }

    activity.status = ActivityStatus.PUBLISHED;
    return this.activitiesRepository.save(activity);
  }

  async generateInviteQRCode(id: string, user: User): Promise<string> {
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
  }

  async join(id: string, user: User): Promise<Activity> {
    console.log(user);
    const activity = await this.findOne(id);

    if (activity.status !== ActivityStatus.PUBLISHED) {
      throw new BadRequestException('Activity is not open for registration');
    }

    if (activity.currentParticipants >= activity.maxParticipants) {
      throw new BadRequestException('Activity is full');
    }

    // TODO: Add participant to activity
    activity.currentParticipants += 1;

    return this.activitiesRepository.save(activity);
  }

  async cancel(id: string, user: User): Promise<Activity> {
    const activity = await this.findOne(id);

    if (activity.creator.id !== user.id) {
      throw new ForbiddenException('Only creator can cancel activity');
    }

    if (activity.status === ActivityStatus.ENDED) {
      throw new BadRequestException('Cannot cancel ended activity');
    }

    activity.status = ActivityStatus.CANCELLED;
    return this.activitiesRepository.save(activity);
  }
}
