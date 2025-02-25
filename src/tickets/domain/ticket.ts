import { ApiProperty } from '@nestjs/swagger';
import { Activity } from '../../activities/domain/activity';
import { User } from '../../users/domain/user';

export enum TicketStatus {
  PENDING = 'pending',
  AVAILABLE = 'available',
  SOLD = 'sold',
  RESERVED = 'reserved',
  CANCELLED = 'cancelled',
}

export class Ticket {
  @ApiProperty({
    description: '票务ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: '活动信息',
    type: () => Activity,
  })
  activity: Activity;

  @ApiProperty({
    description: '用户信息',
    type: () => User,
  })
  user: User;

  @ApiProperty({
    description: '票务状态',
    enum: TicketStatus,
    default: TicketStatus.PENDING,
  })
  status: TicketStatus;

  @ApiProperty({
    description: '参加时间',
    type: Date,
    required: false,
  })
  joinTime?: Date;

  @ApiProperty({
    description: '取消时间',
    type: Date,
    required: false,
  })
  cancelTime?: Date;

  @ApiProperty({
    description: '是否已删除',
    type: Boolean,
    default: false,
  })
  isDeleted: boolean;

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
