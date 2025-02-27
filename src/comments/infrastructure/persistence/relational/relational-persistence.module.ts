import { Module } from '@nestjs/common';
import { commentsRepository } from '../comments.repository';
import { commentsRelationalRepository } from './repositories/comments.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { commentsEntity } from './entities/comments.entity';

@Module({
  imports: [TypeOrmModule.forFeature([commentsEntity])],
  providers: [
    {
      provide: commentsRepository,
      useClass: commentsRelationalRepository,
    },
  ],
  exports: [commentsRepository],
})
export class RelationalcommentsPersistenceModule {}
