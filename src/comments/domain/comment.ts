import { ApiProperty } from '@nestjs/swagger';
import { Activity } from '@/activities/domain/activity';
import { User } from '@/users/domain/user';

export class Comment {
  @ApiProperty({
    type: String,
    format: 'uuid',
    description: '评论ID',
  })
  id: string;

  @ApiProperty({
    type: String,
    description: '评论内容',
  })
  content: string;

  @ApiProperty({
    type: () => Activity,
    description: '关联的活动',
  })
  activity: Activity;

  @ApiProperty({
    type: () => User,
    description: '评论作者',
  })
  user: User;

  @ApiProperty({
    type: () => Comment,
    nullable: true,
    description: '父评论（如果这是一个回复）',
  })
  parent?: Comment;

  @ApiProperty({
    type: () => [Comment],
    description: '子评论列表',
  })
  replies: Comment[];

  @ApiProperty({
    type: Boolean,
    default: false,
    description: '评论是否已删除',
  })
  isDeleted: boolean;

  @ApiProperty({
    description: '创建时间',
  })
  createdAt: Date;

  @ApiProperty({
    description: '删除时间',
    type: Date,
    required: false,
  })
  deletedAt?: Date;

  @ApiProperty({
    description: '更新时间',
  })
  updatedAt: Date;

  constructor(partial?: Partial<Comment>) {
    if (partial) {
      Object.assign(this, partial);
    }
    this.replies = this.replies || [];
    this.isDeleted = this.isDeleted || false;
  }
}
