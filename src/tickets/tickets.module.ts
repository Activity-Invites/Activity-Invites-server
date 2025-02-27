import { Module } from '@nestjs/common';
import { ticketsService } from './tickets.service';
import { ticketsController } from './tickets.controller';
import { RelationalticketsPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import databaseConfig from '../database/config/database.config';
import { DatabaseConfig } from '../database/config/database-config.type';
import { DocumentticketsPersistenceModule } from './infrastructure/persistence/document/document-persistence.module';

const infrastructurePersistenceModule = (databaseConfig() as DatabaseConfig)
  .isDocumentDatabase
  ? DocumentticketsPersistenceModule
  : RelationalticketsPersistenceModule;

@Module({
  imports: [
    // import modules, etc.
    infrastructurePersistenceModule,
  ],
  controllers: [ticketsController],
  providers: [ticketsService],
  exports: [ticketsService, infrastructurePersistenceModule],
})
export class ticketsModule {}
