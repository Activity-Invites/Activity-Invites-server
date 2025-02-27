import { Module } from '@nestjs/common';
import { commentsService } from './comments.service';
import { commentsController } from './comments.controller';
import { RelationalcommentsPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import databaseConfig from '../database/config/database.config';
import { DatabaseConfig } from '../database/config/database-config.type';
import { DocumentcommentsPersistenceModule } from './infrastructure/persistence/document/document-persistence.module';

const infrastructurePersistenceModule = (databaseConfig() as DatabaseConfig)
  .isDocumentDatabase
  ? DocumentcommentsPersistenceModule
  : RelationalcommentsPersistenceModule;

@Module({
  imports: [
    // import modules, etc.
    infrastructurePersistenceModule,
  ],
  controllers: [commentsController],
  providers: [commentsService],
  exports: [commentsService, infrastructurePersistenceModule],
})
export class commentsModule {}
