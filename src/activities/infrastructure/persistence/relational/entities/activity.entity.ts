import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '@/users/infrastructure/persistence/relational/entities/user.entity';
import { ThemeEntity } from '@/themes/infrastructure/persistence/relational/entities/theme.entity';
import { TicketEntity } from '@/tickets/infrastructure/persistence/relational/entities/ticket.entity';
import { CommentEntity } from '@/comments/infrastructure/persistence/relational/entities/comment.entity';
import { ActivityStatus, ActivityType } from '@/activities/domain/activity';

@Entity('activities')
export class ActivityEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ comment: '活动名称' })
  name: string;

  @Column({ comment: '主图' })
  mainImage: string;

  @Column('simple-array', { comment: '介绍图片' })
  introImages: string[];

  @Column({ comment: '开始时间' })
  startTime: Date;

  @Column({ comment: '结束时间' })
  endTime: Date;

  @Column({ comment: '活动地点' })
  location: string;

  @Column({ default: false, comment: '是否公开' })
  isPublic: boolean;

  @Column('text', { comment: '活动描述' })
  description: string;

  @Column({
    type: 'enum',
    enum: ActivityStatus,
    default: ActivityStatus.DRAFT,
    comment: '活动状态',
  })
  status: ActivityStatus;

  @Column({
    type: 'enum',
    enum: ActivityType,
    default: ActivityType.FREE,
    comment: '活动类型',
  })
  type: ActivityType;

  @Column({ type: 'int', comment: '最小参与人数' })
  minParticipants: number;

  @Column({ type: 'int', comment: '最大参与人数' })
  maxParticipants: number;

  @Column({ type: 'int', comment: '候补名额' })
  waitingListLimit: number;

  @Column({ type: 'int', default: 0, comment: '当前参与人数' })
  currentParticipants: number;

  @ManyToOne(() => UserEntity, { eager: true })
  @JoinColumn({ name: 'creator_id' })
  creator: UserEntity;

  @ManyToOne(() => ThemeEntity, { eager: true })
  @JoinColumn({ name: 'theme_id' })
  theme: ThemeEntity;

  @OneToMany(() => TicketEntity, (ticket) => ticket.activity)
  tickets: TicketEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.activity)
  comments: CommentEntity[];

  @ManyToMany(() => UserEntity)
  @JoinTable({
    name: 'activity_participants',
    joinColumn: {
      name: 'activity_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
  participants: UserEntity[];

  @CreateDateColumn({ comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  updatedAt: Date;

  @DeleteDateColumn({ comment: '删除时间' })
  deletedAt?: Date;
}
