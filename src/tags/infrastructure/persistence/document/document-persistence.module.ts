import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  TagsSchema,
  TagsSchemaClass,
} from './entities/tags.schema';
import { TagsRepository } from '../tags.repository';
import { TagsDocumentRepository } from './repositories/tags.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TagsSchemaClass.name, schema: TagsSchema },
    ]),
  ],
  providers: [
    {
      provide: TagsRepository,
      useClass: TagsDocumentRepository,
    },
  ],
  exports: [TagsRepository],
})
export class DocumentTagsPersistenceModule {}
