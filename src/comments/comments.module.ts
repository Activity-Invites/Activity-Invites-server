import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { RelationalCommentPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { DocumentCommentPersistenceModule } from './infrastructure/persistence/document/document-persistence.module';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    process.env.DATABASE_TYPE === 'mongodb'
      ? DocumentCommentPersistenceModule
      : RelationalCommentPersistenceModule,
  ],
  controllers: [CommentsController],
  providers: [CommentsService, ConfigService],
  exports: [CommentsService],
})
export class CommentsModule {}
