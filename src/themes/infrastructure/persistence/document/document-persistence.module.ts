import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ThemeSchemaClass } from './entities/theme.schema';
import { DocumentThemeRepository } from './repositories/theme.repository';
import { ThemeRepository } from '../theme.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ThemeSchemaClass.name, schema: ThemeSchemaClass },
    ]),
  ],
  providers: [
    {
      provide: ThemeRepository,
      useClass: DocumentThemeRepository,
    },
  ],
  exports: [ThemeRepository],
})
export class DocumentPersistenceModule {}
