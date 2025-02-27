import { Module } from '@nestjs/common';
import { activitiesRepository } from '../activities.repository';
import { activitiesRelationalRepository } from './repositories/activities.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { activitiesEntity } from './entities/activities.entity';

@Module({
  imports: [TypeOrmModule.forFeature([activitiesEntity])],
  providers: [
    {
      provide: activitiesRepository,
      useClass: activitiesRelationalRepository,
    },
  ],
  exports: [activitiesRepository],
})
export class RelationalactivitiesPersistenceModule {}
