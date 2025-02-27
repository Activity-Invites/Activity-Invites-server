import { themesModule } from '../themes/themes.module';
import { Module } from '@nestjs/common';
import { activitiesService } from './activities.service';
import { activitiesController } from './activities.controller';
import { RelationalactivitiesPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import databaseConfig from '../database/config/database.config';
import { DatabaseConfig } from '../database/config/database-config.type';
import { DocumentactivitiesPersistenceModule } from './infrastructure/persistence/document/document-persistence.module';

const infrastructurePersistenceModule = (databaseConfig() as DatabaseConfig)
  .isDocumentDatabase
  ? DocumentactivitiesPersistenceModule
  : RelationalactivitiesPersistenceModule;

@Module({
  imports: [
    themesModule,

    // import modules, etc.
    infrastructurePersistenceModule,
  ],
  controllers: [activitiesController],
  providers: [activitiesService],
  exports: [activitiesService, infrastructurePersistenceModule],
})
export class activitiesModule {}
