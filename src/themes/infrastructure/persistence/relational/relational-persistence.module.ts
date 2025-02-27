import { Module } from '@nestjs/common';
import { themesRepository } from '../themes.repository';
import { themesRelationalRepository } from './repositories/themes.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { themesEntity } from './entities/themes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([themesEntity])],
  providers: [
    {
      provide: themesRepository,
      useClass: themesRelationalRepository,
    },
  ],
  exports: [themesRepository],
})
export class RelationalthemesPersistenceModule {}
