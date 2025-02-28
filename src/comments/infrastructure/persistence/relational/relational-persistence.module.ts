import { Module } from '@nestjs/common';
import { CommentsRepository } from '../comments.repository';
import { CommentsRelationalRepository } from './repositories/comments.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsEntity } from './entities/comments.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CommentsEntity])],
  providers: [
    {
      provide: CommentsRepository,
      useClass: CommentsRelationalRepository,
    },
  ],
  exports: [CommentsRepository],
})
export class RelationalCommentsPersistenceModule {}
