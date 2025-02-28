import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString, IsBoolean, IsDate } from 'class-validator';
import { ActivityStatus, ActivityType } from '../domain/activity';

export class FilterActivityDto {
  @ApiProperty({
    description: '活动状态',
    enum: ActivityStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(ActivityStatus)
  status?: ActivityStatus;

  @ApiProperty({
    description: '活动类型',
    enum: ActivityType,
    required: false,
  })
  @IsOptional()
  @IsEnum(ActivityType)
  type?: ActivityType;

  @ApiProperty({
    description: '创建者ID',
    required: false,
  })
  @IsOptional()
  @IsString()
  creatorId?: string;

  @ApiProperty({
    description: '主题ID',
    required: false,
  })
  @IsOptional()
  @IsString()
  themeId?: string;

  @ApiProperty({
    description: '是否公开',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isPublic?: boolean;

  @ApiProperty({
    description: '活动地点',
    required: false,
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({
    description: '开始时间',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  startTime?: Date;

  @ApiProperty({
    description: '结束时间',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  endTime?: Date;
}

export class SortActivityDto {
  @ApiProperty({
    description: '排序字段',
    enum: [
      'id',
      'name',
      'startTime',
      'endTime',
      'location',
      'status',
      'type',
      'createdAt',
      'updatedAt',
    ],
  })
  @IsEnum([
    'id',
    'name',
    'startTime',
    'endTime',
    'location',
    'status',
    'type',
    'createdAt',
    'updatedAt',
  ])
  orderBy: string;

  @ApiProperty({
    description: '排序方向',
    enum: ['ASC', 'DESC'],
  })
  @IsEnum(['ASC', 'DESC'])
  order: 'ASC' | 'DESC';
}
