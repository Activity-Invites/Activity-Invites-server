import { ThemesEntity } from '../../../../../themes/infrastructure/persistence/relational/entities/themes.entity';

import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
  name: 'activities',
})
export class ActivitiesEntity extends EntityRelationalHelper {
  @Column({
    nullable: false,
    type: Date,
  })
  endTime: Date;

  @Column({
    nullable: false,
    type: Date,
  })
  startTime: Date;

  @Column({
    nullable: false,
    type: String,
  })
  mainImage?: string;

  @Column({
    nullable: false,
    type: String,
  })
  name?: string;

  @Column({
    nullable: false,
    type: 'jsonb',
  })
  themeId: ThemesEntity;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
