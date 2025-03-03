import { Module } from '@nestjs/common';
import { UserRepository } from '../user.repository';
import { UserPrismaRepository } from './repositories/user.repository';
import { PrismaModule } from '../../../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: UserRepository,
      useClass: UserPrismaRepository,
    },
  ],
  exports: [UserRepository],
})
export class PrismaUserPersistenceModule {}
