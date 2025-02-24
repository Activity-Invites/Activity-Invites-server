import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Activity } from '@/activities/domain/activities.entity';

export enum TicketStatus {
  AVAILABLE = 'available',
  SOLD = 'sold',
  RESERVED = 'reserved',
  CANCELLED = 'cancelled',
}

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('text')
  description: string;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'int', default: 0 })
  soldCount: number;

  @Column({
    type: 'enum',
    enum: TicketStatus,
    default: TicketStatus.AVAILABLE,
  })
  status: TicketStatus;

  @ManyToOne(() => Activity, (activity) => activity.tickets)
  @JoinColumn()
  activity: Activity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
