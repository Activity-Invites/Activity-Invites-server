import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ActivityEntity } from '@/activities/infrastructure/persistence/relational/entities/activity.entity';
import { UserEntity } from '@/users/infrastructure/persistence/relational/entities/user.entity';
import { TicketStatus } from '@/tickets/domain/ticket.types';

@Entity('tickets')
export class TicketEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ActivityEntity, (activity) => activity.tickets, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'activity_id' })
  activity: ActivityEntity;

  @ManyToOne(() => UserEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({
    type: 'enum',
    enum: TicketStatus,
    default: TicketStatus.PENDING,
  })
  status: TicketStatus;

  @Column({ type: 'timestamp', nullable: true })
  joinTime?: Date;

  @Column({ type: 'timestamp', nullable: true })
  cancelTime?: Date;

  @Column('boolean', {
    default: false,
    comment: '是否已删除',
  })
  isDeleted: boolean;

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
