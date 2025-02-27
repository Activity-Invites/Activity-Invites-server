import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  commentsSchema,
  commentsSchemaClass,
} from './entities/comments.schema';
import { commentsRepository } from '../comments.repository';
import { commentsDocumentRepository } from './repositories/comments.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: commentsSchemaClass.name, schema: commentsSchema },
    ]),
  ],
  providers: [
    {
      provide: commentsRepository,
      useClass: commentsDocumentRepository,
    },
  ],
  exports: [commentsRepository],
})
export class DocumentcommentsPersistenceModule {}
