import { Module } from '@nestjs/common';
import { ActivitiesRepository } from '../activities.repository';
import { activitiesRelationalRepository } from './repositories/activities.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivitiesEntity } from './entities/activities.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ActivitiesEntity])],
  providers: [
    {
      provide: ActivitiesRepository,
      useClass: activitiesRelationalRepository,
    },
  ],
  exports: [ActivitiesRepository],
})
export class RelationalActivitiesPersistenceModule {}
