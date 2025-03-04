import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionRepository } from './repositories/session.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [SessionService, SessionRepository],
  exports: [SessionService, SessionRepository],
})
export class SessionModule {}
