import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from './entities/comment.entity';
import { CommentRepository } from '../comment.repository';
import { CommentsRelationalRepository } from './repositories/comment.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CommentEntity])],
  providers: [
    {
      provide: CommentRepository,
      useClass: CommentsRelationalRepository,
    },
  ],
  exports: [CommentRepository],
})
export class RelationalCommentPersistenceModule {}
