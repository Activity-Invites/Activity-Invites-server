import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ThemesSchema, ThemesSchemaClass } from './entities/themes.schema';
import { ThemesRepository } from '../themes.repository';
import { ThemesDocumentRepository } from './repositories/themes.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ThemesSchemaClass.name, schema: ThemesSchema },
    ]),
  ],
  providers: [
    {
      provide: ThemesRepository,
      useClass: ThemesDocumentRepository,
    },
  ],
  exports: [ThemesRepository],
})
export class DocumentThemesPersistenceModule {}
