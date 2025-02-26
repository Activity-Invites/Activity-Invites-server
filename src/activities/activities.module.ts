import { Module } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { ActivitiesController } from './activities.controller';
import { QRCodeService } from '../utils/qrcode.service';
import { DatabaseConfig } from '@/database/config/database-config.type';
import databaseConfig from '../database/config/database.config';
import { DocumentActivityPersistenceModule } from './infrastructure/persistence/document/document-persistence.module';
import { RelationalActivityPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

// <database-block>
const infrastructurePersistenceModule = (databaseConfig() as DatabaseConfig)
  .isDocumentDatabase
  ? DocumentActivityPersistenceModule
  : RelationalActivityPersistenceModule;
// </database-block>

@Module({
  imports: [
    infrastructurePersistenceModule
  ],
  controllers: [ActivitiesController],
  providers: [
    ActivitiesService,
    QRCodeService,
  ],
  exports: [ActivitiesService],
})
export class ActivitiesModule {}
