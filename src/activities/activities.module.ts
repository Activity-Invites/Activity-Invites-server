import { ThemesModule } from '../themes/themes.module';
import { Module } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { ActivitiesController } from './activities.controller';
import { RelationalActivitiesPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import databaseConfig from '../database/config/database.config';
import { DatabaseConfig } from '../database/config/database-config.type';
import { DocumentActivitiesPersistenceModule } from './infrastructure/persistence/document/document-persistence.module';
import { TicketsModule } from '@/tickets/tickets.module';
import { CommentsModule } from '@/comments/comments.module';

const infrastructurePersistenceModule = (databaseConfig() as DatabaseConfig)
  .isDocumentDatabase
  ? DocumentActivitiesPersistenceModule
  : RelationalActivitiesPersistenceModule;

@Module({
  imports: [
    ThemesModule, 
    ActivitiesModule,
    TicketsModule,
    CommentsModule,
    // import modules, etc.
    infrastructurePersistenceModule,
  ],
  controllers: [ActivitiesController],
  providers: [ActivitiesService],
  exports: [ActivitiesService, infrastructurePersistenceModule],
})
export class ActivitiesModule {}
