import { Column, Entity, PrimaryColumn } from 'typeorm';
import { RoleEnum } from '../roles.enum';

@Entity()
export class Role {
  @PrimaryColumn()
  id: RoleEnum;

  @Column()
  name: string;
}
