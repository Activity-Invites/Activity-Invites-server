import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsArray,
  IsDate,
  IsBoolean,
  IsEnum,
  IsInt,
  Min,
  Max,
  ArrayMinSize,
  ValidateNested,
} from 'class-validator';
import { ActivityStatus, ActivityType } from '../domain/activity';

export class UpdateActivityDto {
  @ApiProperty({
    description: '活动名称',
    example: '2025北京户外徒步活动',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: '主图',
    example: 'https://example.com/main-image.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  mainImage?: string;

  @ApiProperty({
    description: '介绍图片',
    example: ['https://example.com/intro-image-1.jpg'],
    type: [String],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(0)
  @IsOptional()
  introImages?: string[];

  @ApiProperty({
    description: '开始时间',
    example: '2024-01-01T00:00:00.000Z',
    type: Date,
    required: false,
  })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  startTime?: Date;

  @ApiProperty({
    description: '结束时间',
    example: '2024-01-01T00:00:00.000Z',
    type: Date,
    required: false,
  })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  endTime?: Date;

  @ApiProperty({
    description: '活动地点',
    example: '北京市海淀区',
    required: false,
  })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({
    description: '是否公开',
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;

  @ApiProperty({
    description: '活动描述',
    example: '这是一个精彩的户外徒步活动！',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: '活动状态',
    enum: ActivityStatus,
    required: false,
  })
  @IsEnum(ActivityStatus)
  @IsOptional()
  status?: ActivityStatus;

  @ApiProperty({
    description: '活动类型',
    enum: ActivityType,
    required: false,
  })
  @IsEnum(ActivityType)
  @IsOptional()
  type?: ActivityType;

  @ApiProperty({
    description: '最小参与人数',
    example: 5,
    type: Number,
    required: false,
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  minParticipants?: number;

  @ApiProperty({
    description: '最大参与人数',
    example: 20,
    type: Number,
    required: false,
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  maxParticipants?: number;

  @ApiProperty({
    description: '候补名额',
    example: 5,
    type: Number,
    required: false,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  waitingListLimit?: number;
}
