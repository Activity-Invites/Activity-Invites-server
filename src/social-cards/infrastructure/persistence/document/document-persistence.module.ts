import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  SocialCardSchema,
  SocialCardSchemaClass,
} from './entities/social-card.schema';
import { SocialCardRepository } from '../social-card.repository';
import { SocialCardDocumentRepository } from './repositories/social-card.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SocialCardSchemaClass.name, schema: SocialCardSchema },
    ]),
  ],
  providers: [
    {
      provide: SocialCardRepository,
      useClass: SocialCardDocumentRepository,
    },
  ],
  exports: [SocialCardRepository],
})
export class DocumentSocialCardPersistenceModule {}
