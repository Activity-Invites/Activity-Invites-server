import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID, IsString, IsIn, IsEnum, IsNotEmpty } from 'class-validator';

export enum CommentSortField {
  ID = 'id',
  CONTENT = 'content',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

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
    enum: CommentSortField,
    example: CommentSortField.CREATED_AT,
  })
  @IsNotEmpty()
  @IsEnum(CommentSortField)
  field: CommentSortField;

  @ApiProperty({
    description: '排序方向',
    enum: SortOrder,
    example: SortOrder.DESC,
  })
  @IsNotEmpty()
  @IsEnum(SortOrder)
  order: SortOrder = SortOrder.DESC;
}
