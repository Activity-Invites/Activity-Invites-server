import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID, IsString, IsIn, IsEnum } from 'class-validator';
import { TicketStatus } from '../domain/ticket.types';

export class FilterTicketDto {
  @ApiProperty({
    description: '活动ID',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  activityId?: string;

  @ApiProperty({
    description: '用户ID',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiProperty({
    description: '票务状态',
    enum: TicketStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(TicketStatus)
  status?: TicketStatus;
}

export class SortTicketDto {
  @ApiProperty({
    description: '排序字段',
    enum: ['createdAt', 'updatedAt', 'joinTime', 'cancelTime'],
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsIn(['createdAt', 'updatedAt', 'joinTime', 'cancelTime'])
  orderBy?: string;

  @ApiProperty({
    description: '排序方向',
    enum: ['ASC', 'DESC'],
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsIn(['ASC', 'DESC'])
  order?: 'ASC' | 'DESC' = 'DESC';
}
