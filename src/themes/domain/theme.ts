import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Activity } from '@/activities/domain/activity';

@Entity()
export class Theme {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: '主题ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @Column()
  @ApiProperty({
    description: '主题名称',
    example: '户外运动',
  })
  name: string;

  @Column('text')
  @ApiProperty({
    description: '主题描述',
    example: '这是一个户外运动主题，包含各种户外活动。',
  })
  description: string;

  @Column()
  @ApiProperty({
    description: '主题分类',
    example: '运动',
  })
  category: string;

  @Column('text', { array: true })
  @ApiProperty({
    description: '主题标签',
    example: ['户外', '运动', '健康'],
    type: [String],
  })
  tags: string[];

  @Column({ nullable: true })
  @ApiProperty({
    description: '封面图片',
    example: 'https://example.com/images/outdoor.jpg',
    required: false,
  })
  coverImage?: string;

  @Column({ default: false })
  @ApiProperty({
    description: '是否已删除',
    default: false,
  })
  isDeleted: boolean;

  @OneToMany(() => Activity, (activity) => activity.theme)
  @ApiProperty({
    description: '相关活动',
    type: () => [Activity],
  })
  activities?: Activity[];

  @CreateDateColumn()
  @ApiProperty({
    description: '创建时间',
    type: Date,
  })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({
    description: '更新时间',
    type: Date,
  })
  updatedAt: Date;

  @Column({ nullable: true })
  @ApiProperty({
    description: '删除时间',
    type: Date,
    required: false,
  })
  deletedAt?: Date;
}
