import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    description: '评论内容',
    example: '这是一条评论',
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({
    description: '活动ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsUUID()
  activityId: string;

  @ApiProperty({
    description: '父评论ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  parentId?: string;

  // This will be set by the controller
  userId?: string;
}
