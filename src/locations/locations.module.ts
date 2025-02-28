import { Module } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { LocationsController } from './locations.controller';
import { RelationalLocationPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import databaseConfig from '../database/config/database.config';
import { DatabaseConfig } from '../database/config/database-config.type';
import { DocumentLocationPersistenceModule } from './infrastructure/persistence/document/document-persistence.module';

const infrastructurePersistenceModule = (databaseConfig() as DatabaseConfig)
  .isDocumentDatabase
  ? DocumentLocationPersistenceModule
  : RelationalLocationPersistenceModule;

@Module({
  imports: [
    // import modules, etc.
    infrastructurePersistenceModule,
  ],
  controllers: [LocationsController],
  providers: [LocationsService],
  exports: [LocationsService, infrastructurePersistenceModule],
})
export class LocationsModule {}
