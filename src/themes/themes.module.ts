import { Module } from '@nestjs/common';
import { themesService } from './themes.service';
import { themesController } from './themes.controller';
import { RelationalthemesPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import databaseConfig from '../database/config/database.config';
import { DatabaseConfig } from '../database/config/database-config.type';
import { DocumentthemesPersistenceModule } from './infrastructure/persistence/document/document-persistence.module';

const infrastructurePersistenceModule = (databaseConfig() as DatabaseConfig)
  .isDocumentDatabase
  ? DocumentthemesPersistenceModule
  : RelationalthemesPersistenceModule;

@Module({
  imports: [
    // import modules, etc.
    infrastructurePersistenceModule,
  ],
  controllers: [themesController],
  providers: [themesService],
  exports: [themesService, infrastructurePersistenceModule],
})
export class themesModule {}
