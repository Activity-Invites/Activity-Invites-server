import { Module } from '@nestjs/common';
import { ThemesService } from './themes.service';
import { ThemesController } from './themes.controller';
import { RelationalThemePersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { DocumentPersistenceModule } from './infrastructure/persistence/document/document-persistence.module';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    process.env.DATABASE_TYPE === 'mongodb'
      ? DocumentPersistenceModule
      : RelationalThemePersistenceModule,
  ],
  controllers: [ThemesController],
  providers: [ThemesService, ConfigService],
  exports: [ThemesService],
})
export class ThemesModule {}
