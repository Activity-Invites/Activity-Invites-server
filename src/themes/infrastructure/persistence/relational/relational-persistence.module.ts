import { Module } from '@nestjs/common';
import { ThemeRepository } from '../theme.repository';
import { RelationalThemeRepository } from './repositories/theme.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThemeEntity } from './entities/theme.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ThemeEntity])],
  providers: [
    {
      provide: ThemeRepository,
      useClass: RelationalThemeRepository,
    },
  ],
  exports: [ThemeRepository],
})
export class RelationalThemePersistenceModule {}
