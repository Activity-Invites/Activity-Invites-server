import { Module } from '@nestjs/common';
import { PrismaUserPersistenceModule } from '../prisma/prisma-persistence.module';
import { RelationalUserPersistenceModule } from '../relational/relational-persistence.module';
import { UserRepository } from '../user.repository';
import { HybridUserRepository } from './repositories/user.repository';

@Module({
  imports: [PrismaUserPersistenceModule, RelationalUserPersistenceModule],
  providers: [
    {
      provide: UserRepository,
      useClass: HybridUserRepository,
    },
  ],
  exports: [UserRepository],
})
export class HybridUserPersistenceModule {}
