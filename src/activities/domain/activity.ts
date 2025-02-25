import { ApiProperty } from '@nestjs/swagger';
import { User } from '@/users/domain/user';
import { Theme } from '@/themes/domain/theme';
import { Ticket } from '@/tickets/domain/ticket';
import { Comment } from '@/comments/domain/comment';

export enum ActivityStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  IN_PROGRESS = 'in_progress',
  ENDED = 'ended',
  CANCELLED = 'cancelled',
}

export enum ActivityType {
  FREE = 'free',
  PAID = 'paid',
}

export class Activity {
  @ApiProperty({
    description: '活动ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: '活动名称',
    example: '2025北京户外徒步活动',
  })
  name: string;

  @ApiProperty({
    description: '主图',
    example: 'https://example.com/main-image.jpg',
  })
  mainImage: string;

  @ApiProperty({
    description: '介绍图片',
    example: ['https://example.com/intro-image-1.jpg'],
    type: [String],
  })
  introImages: string[];

  @ApiProperty({
    description: '开始时间',
    example: '2024-01-01T00:00:00.000Z',
    type: Date,
  })
  startTime: Date;

  @ApiProperty({
    description: '结束时间',
    example: '2024-01-01T00:00:00.000Z',
    type: Date,
  })
  endTime: Date;

  @ApiProperty({
    description: '活动地点',
    example: '北京市海淀区',
  })
  location: string;

  @ApiProperty({
    description: '是否公开',
    example: false,
    required: true,
  })
  isPublic: boolean;

  @ApiProperty({
    description: '活动描述',
    example: '这是一个精彩的户外徒步活动！',
  })
  description: string;

  @ApiProperty({
    description: '活动状态',
    enum: ActivityStatus,
    default: ActivityStatus.DRAFT,
  })
  status: ActivityStatus;

  @ApiProperty({
    description: '活动类型',
    enum: ActivityType,
    default: ActivityType.FREE,
  })
  type: ActivityType;

  @ApiProperty({
    description: '最小参与人数',
    example: 5,
    type: Number,
  })
  minParticipants: number;

  @ApiProperty({
    description: '最大参与人数',
    example: 20,
    type: Number,
  })
  maxParticipants: number;

  @ApiProperty({
    description: '候补名额',
    example: 5,
    type: Number,
  })
  waitingListLimit: number;

  @ApiProperty({
    description: '当前参与人数',
    example: 0,
    type: Number,
  })
  currentParticipants: number;

  @ApiProperty({
    description: '是否已删除',
    default: false,
  })
  isDeleted: boolean;

  @ApiProperty({
    description: '创建者',
    type: () => User,
  })
  creator: User;

  @ApiProperty({
    description: '活动主题',
    type: () => Theme,
  })
  theme: Theme;

  @ApiProperty({
    description: '活动票务',
    type: () => [Ticket],
  })
  tickets: Ticket[];

  @ApiProperty({
    description: '活动评论',
    type: () => [Comment],
  })
  comments: Comment[];

  @ApiProperty({
    description: '创建时间',
    type: Date,
  })
  createdAt: Date;

  @ApiProperty({
    description: '更新时间',
    type: Date,
  })
  updatedAt: Date;

  @ApiProperty({
    description: '删除时间',
    type: Date,
    required: false,
  })
  deletedAt?: Date;
}
