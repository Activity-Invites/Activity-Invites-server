import { Module } from '@nestjs/common';
import { ThemesRepository } from '../themes.repository';
import { ThemesRelationalRepository } from './repositories/themes.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThemesEntity } from './entities/themes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ThemesEntity])],
  providers: [
    {
      provide: ThemesRepository,
      useClass: ThemesRelationalRepository,
    },
  ],
  exports: [ThemesRepository],
})
export class RelationalThemesPersistenceModule {}
