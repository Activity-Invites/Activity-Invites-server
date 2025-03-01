import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  TemplatesSchema,
  TemplatesSchemaClass,
} from './entities/templates.schema';
import { TemplatesRepository } from '../templates.repository';
import { TemplatesDocumentRepository } from './repositories/templates.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TemplatesSchemaClass.name, schema: TemplatesSchema },
    ]),
  ],
  providers: [
    {
      provide: TemplatesRepository,
      useClass: TemplatesDocumentRepository,
    },
  ],
  exports: [TemplatesRepository],
})
export class DocumentTemplatesPersistenceModule {}
