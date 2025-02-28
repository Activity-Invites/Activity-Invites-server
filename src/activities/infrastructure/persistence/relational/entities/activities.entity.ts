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
