import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID, IsString, IsIn, IsEnum } from 'class-validator';
import { TicketStatus } from '../domain/ticket';
import { SortOrder } from '@/utils/enum/sort-order';

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
    enum: ['createdAt', 'updatedAt', 'status'],
    required: true,
  })
  @IsString()
  orderBy: string;

  @ApiProperty({
    description: '排序方向',
    enum: SortOrder,
    default: SortOrder.ASC,
  })
  @IsEnum(SortOrder)
  order: SortOrder;
}
