import { Column, Entity, PrimaryColumn } from 'typeorm';
import { StatusEnum } from '../statuses.enum';

@Entity()
export class Status {
  @PrimaryColumn()
  id: StatusEnum;

  @Column()
  name: string;
}
