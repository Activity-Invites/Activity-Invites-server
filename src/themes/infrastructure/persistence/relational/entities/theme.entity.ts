import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ActivityEntity } from '@/activities/infrastructure/persistence/relational/entities/activity.entity';

@Entity('themes')
export class ThemeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    length: 100,
    comment: '主题名称',
  })
  name: string;

  @Column({
    type: 'text',
    comment: '主题描述',
  })
  description: string;

  @Column({
    length: 50,
    comment: '主题分类',
  })
  category: string;

  @Column('simple-array', {
    comment: '主题标签',
    default: [],
  })
  tags: string[];

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: '封面图片',
  })
  coverImage?: string;

  @Column('boolean', {
    default: false,
    comment: '是否已删除',
  })
  isDeleted: boolean;

  @OneToMany(() => ActivityEntity, (activity) => activity.theme)
  activities: ActivityEntity[];

  @CreateDateColumn({
    name: 'created_at',
    comment: '创建时间',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    comment: '更新时间',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    comment: '删除时间',
    nullable: true,
  })
  deletedAt: Date;
}
