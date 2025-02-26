import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ActivityDocument, ActivitySchema } from './entities/activity.schema';
import { DocumentActivityRepository } from './repositories/activity.repository';
import { ActivityRepository } from '../activity.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ActivityDocument.name, schema: ActivitySchema },
    ]),
  ],
  providers: [
    {
      provide: ActivityRepository,
      useClass: DocumentActivityRepository,
    },
  ],
  exports: [ActivityRepository],
})
export class DocumentActivityPersistenceModule {}
