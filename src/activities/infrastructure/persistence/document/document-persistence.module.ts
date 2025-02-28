import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ActivitiesSchema,
  ActivitiesSchemaClass,
} from './entities/activities.schema';
import { ActivitiesRepository } from '../activities.repository';
import { ActivitiesDocumentRepository } from './repositories/activities.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ActivitiesSchemaClass.name, schema: ActivitiesSchema },
    ]),
  ],
  providers: [
    {
      provide: ActivitiesRepository,
      useClass: ActivitiesDocumentRepository,
    },
  ],
  exports: [ActivitiesRepository],
})
export class DocumentActivitiesPersistenceModule {}
