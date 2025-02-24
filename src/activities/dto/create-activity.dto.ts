import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { ActivityStatus, ActivityType } from '../domain/activities.entity';

export class CreateActivityDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  mainImage: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  introImages: string[];

  @ApiProperty()
  @IsDate()
  startTime: Date;

  @ApiProperty()
  @IsDate()
  endTime: Date;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty()
  @IsBoolean()
  isPublic: boolean;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ enum: ActivityType })
  @IsEnum(ActivityType)
  type: ActivityType;

  @ApiProperty()
  @IsInt()
  @Min(0)
  @IsOptional()
  minParticipants?: number;

  @ApiProperty()
  @IsInt()
  @Min(1)
  maxParticipants: number;

  @ApiProperty()
  @IsInt()
  @Min(0)
  @IsOptional()
  waitingListLimit?: number;

  @ApiProperty()
  @IsUUID()
  @IsOptional()
  themeId?: string;
}
