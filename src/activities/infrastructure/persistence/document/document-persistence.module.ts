import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  activitiesSchema,
  activitiesSchemaClass,
} from './entities/activities.schema';
import { activitiesRepository } from '../activities.repository';
import { activitiesDocumentRepository } from './repositories/activities.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: activitiesSchemaClass.name, schema: activitiesSchema },
    ]),
  ],
  providers: [
    {
      provide: activitiesRepository,
      useClass: activitiesDocumentRepository,
    },
  ],
  exports: [activitiesRepository],
})
export class DocumentactivitiesPersistenceModule {}
