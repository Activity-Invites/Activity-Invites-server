import { Module } from '@nestjs/common';
import { SocialCardsService } from './social-cards.service';
import { SocialCardsController } from './social-cards.controller';
import { RelationalSocialCardPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import databaseConfig from '../database/config/database.config';
import { DatabaseConfig } from '../database/config/database-config.type';
import { DocumentSocialCardPersistenceModule } from './infrastructure/persistence/document/document-persistence.module';

const infrastructurePersistenceModule = (databaseConfig() as DatabaseConfig)
  .isDocumentDatabase
  ? DocumentSocialCardPersistenceModule
  : RelationalSocialCardPersistenceModule;

@Module({
  imports: [
    // import modules, etc.
    infrastructurePersistenceModule,
  ],
  controllers: [SocialCardsController],
  providers: [SocialCardsService],
  exports: [SocialCardsService, infrastructurePersistenceModule],
})
export class SocialCardsModule {}
