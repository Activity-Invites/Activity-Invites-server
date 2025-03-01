import { Module } from '@nestjs/common';
import { TemplatesRepository } from '../templates.repository';
import { TemplatesRelationalRepository } from './repositories/templates.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemplatesEntity } from './entities/templates.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TemplatesEntity])],
  providers: [
    {
      provide: TemplatesRepository,
      useClass: TemplatesRelationalRepository,
    },
  ],
  exports: [TemplatesRepository],
})
export class RelationalTemplatesPersistenceModule {}
