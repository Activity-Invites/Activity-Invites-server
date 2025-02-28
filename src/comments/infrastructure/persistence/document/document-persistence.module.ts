import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CommentsSchema,
  CommentsSchemaClass,
} from './entities/comments.schema';
import { CommentsRepository } from '../comments.repository';
import { CommentsDocumentRepository } from './repositories/comments.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CommentsSchemaClass.name, schema: CommentsSchema },
    ]),
  ],
  providers: [
    {
      provide: CommentsRepository,
      useClass: CommentsDocumentRepository,
    },
  ],
  exports: [CommentsRepository],
})
export class DocumentCommentsPersistenceModule {}
