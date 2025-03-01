import { Module } from '@nestjs/common';
import { TagsRepository } from '../tags.repository';
import { TagsRelationalRepository } from './repositories/tags.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagsEntity } from './entities/tags.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TagsEntity])],
  providers: [
    {
      provide: TagsRepository,
      useClass: TagsRelationalRepository,
    },
  ],
  exports: [TagsRepository],
})
export class RelationalTagsPersistenceModule {}
