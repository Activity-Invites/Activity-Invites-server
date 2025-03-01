import { Module } from '@nestjs/common';
import { SocialCardRepository } from '../social-card.repository';
import { SocialCardRelationalRepository } from './repositories/social-card.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocialCardEntity } from './entities/social-card.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SocialCardEntity])],
  providers: [
    {
      provide: SocialCardRepository,
      useClass: SocialCardRelationalRepository,
    },
  ],
  exports: [SocialCardRepository],
})
export class RelationalSocialCardPersistenceModule {}
