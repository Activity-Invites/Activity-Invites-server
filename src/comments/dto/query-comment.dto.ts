import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID, IsString, IsIn } from 'class-validator';

export class FilterCommentDto {
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
    description: '父评论ID',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  parentId?: string;
}

export class SortCommentDto {
  @ApiProperty({
    description: '排序字段',
    enum: ['createdAt', 'updatedAt'],
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsIn(['createdAt', 'updatedAt'])
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
