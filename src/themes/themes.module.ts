import { Module } from '@nestjs/common';
import { ThemesService } from './themes.service';
import { ThemesController } from './themes.controller';
import { ThemesRepository } from './repositories/themes.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
  ],
  controllers: [ThemesController],
  providers: [ThemesService, ThemesRepository],
  exports: [ThemesService, ThemesRepository],
})
export class ThemesModule {}
