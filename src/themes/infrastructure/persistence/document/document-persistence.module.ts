import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { themesSchema, themesSchemaClass } from './entities/themes.schema';
import { themesRepository } from '../themes.repository';
import { themesDocumentRepository } from './repositories/themes.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: themesSchemaClass.name, schema: themesSchema },
    ]),
  ],
  providers: [
    {
      provide: themesRepository,
      useClass: themesDocumentRepository,
    },
  ],
  exports: [themesRepository],
})
export class DocumentthemesPersistenceModule {}
