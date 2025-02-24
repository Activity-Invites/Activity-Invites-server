import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/domain/user';
import { Theme } from '../../themes/entities/theme.entity';
import { Ticket } from '../../tickets/entities/ticket.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { ApiProperty } from '@nestjs/swagger';
import databaseConfig from '../../database/config/database.config';
import { DatabaseConfig } from '../../database/config/database-config.type';

export enum ActivityStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  IN_PROGRESS = 'in_progress',
  ENDED = 'ended',
  CANCELLED = 'cancelled',
}

const idType = (databaseConfig() as DatabaseConfig).isDocumentDatabase
  ? String
  : Number;

export enum ActivityType {
  FREE = 'free',
  PAID = 'paid',
}

export class Activity {
  @ApiProperty({
    type: idType,
  })
  id: string;

  @ApiProperty({
    type: String,
    example: 'Activity 1 For Beijing 2025',
  })
  name: string;

  @ApiProperty({
    type: String,
    example: 'https://example.com/main-image.jpg',
  })
  mainImage: string;

  @ApiProperty({
    type: Array,
    example: ['https://example.com/intro-image-1.jpg', 'https://example.com/intro-image-2.jpg'],
  })
  introImages: string[];

  @ApiProperty({
    type: Date,
    example: '2024-01-01T00:00:00.000Z',
  })
  startTime: Date;

  @ApiProperty({
    type: Date,
    example: '2024-01-01T00:00:00.000Z',
  })
  endTime: Date;

  @ApiProperty({
    type: String,
    example: 'Beijing 2025',
  })
  location: string;

  @ApiProperty({
    type: Boolean,
    example: false,
    required: true
  })
  isPublic: boolean;

  @ApiProperty({
    type: String,
    example: 'This is an amazing activity!',
  })
  description: string;

  @ApiProperty({
    type: String,
    enum: ActivityStatus,
    default: ActivityStatus.DRAFT,
  })
  status: ActivityStatus;

  @ApiProperty({
    type: String,
    enum: ActivityType,
    default: ActivityType.FREE,
  })
  type: ActivityType;

  @ApiProperty({
    type: Number,
    example: 0,
  })
  minParticipants: number;

  @ApiProperty({
    type: Number,
    example: 0,
  })
  maxParticipants: number;

  @ApiProperty({
    type: Number,
    example: 0,
  })
  waitingListLimit: number;

  @ApiProperty({
    type: Number,
    example: 0,
  })
  currentParticipants: number;

  @ApiProperty({
    type: () => User,
  })
  creator: User;

  @ApiProperty({
    type: () => Theme,
  })
  theme: Theme;

  @ApiProperty({
    type: () => [Ticket],
  })
  tickets: Ticket[];

  @ApiProperty({
    type: () => [Comment],
  })
  comments: Comment[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
