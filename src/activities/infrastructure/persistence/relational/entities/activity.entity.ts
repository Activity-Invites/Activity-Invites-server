import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '@/users/infrastructure/persistence/relational/entities/user.entity';
import { Theme } from '@/themes/entities/theme.entity';
import { Ticket } from '@/tickets/entities/ticket.entity';
import { Comment } from '@/comments/entities/comment.entity';
import { ActivityStatus, ActivityType } from '@/activities/domain/activities.entity';

@Entity()
export class ActivityEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  mainImage: string;

  @Column('simple-array')
  introImages: string[];

  @Column()
  startTime: Date;

  @Column()
  endTime: Date;

  @Column()
  location: string;

  @Column({ default: false })
  isPublic: boolean;

  @Column('text')
  description: string;

  @Column({
    type: 'enum',
    enum: ActivityStatus,
    default: ActivityStatus.DRAFT,
  })
  status: ActivityStatus;

  @Column({
    type: 'enum',
    enum: ActivityType,
    default: ActivityType.FREE,
  })
  type: ActivityType;

  @Column({ type: 'int', default: 0 })
  minParticipants: number;

  @Column({ type: 'int' })
  maxParticipants: number;

  @Column({ type: 'int', default: 0 })
  waitingListLimit: number;

  @Column({ type: 'int', default: 0 })
  currentParticipants: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn()
  creator: UserEntity;

  @ManyToOne(() => Theme)
  @JoinColumn()
  theme: Theme;

  @OneToMany(() => Ticket, (ticket) => ticket.activity)
  tickets: Ticket[];

  @OneToMany(() => Comment, (comment) => comment.activity)
  comments: Comment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
