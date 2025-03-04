import { ThemesModule } from '../themes/themes.module';
import { Module } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { ActivitiesController } from './activities.controller';
import { ActivitiesRepository } from './repositories/activities.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    ThemesModule,
    PrismaModule,
  ],
  controllers: [ActivitiesController],
  providers: [ActivitiesService, ActivitiesRepository],
  exports: [ActivitiesService, ActivitiesRepository],
})
export class ActivitiesModule {}
