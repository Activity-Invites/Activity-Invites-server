import { Module } from '@nestjs/common';
import { QRCodesService } from './q-r-codes.service';
import { QRCodesController } from './q-r-codes.controller';
import { RelationalQRCodePersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import databaseConfig from '../database/config/database.config';
import { DatabaseConfig } from '../database/config/database-config.type';
import { DocumentQRCodePersistenceModule } from './infrastructure/persistence/document/document-persistence.module';

const infrastructurePersistenceModule = (databaseConfig() as DatabaseConfig)
  .isDocumentDatabase
  ? DocumentQRCodePersistenceModule
  : RelationalQRCodePersistenceModule;

@Module({
  imports: [
    // import modules, etc.
    infrastructurePersistenceModule,
  ],
  controllers: [QRCodesController],
  providers: [QRCodesService],
  exports: [QRCodesService, infrastructurePersistenceModule],
})
export class QRCodesModule {}
