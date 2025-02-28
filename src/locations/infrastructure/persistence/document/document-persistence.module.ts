import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  LocationSchema,
  LocationSchemaClass,
} from './entities/location.schema';
import { LocationRepository } from '../location.repository';
import { LocationDocumentRepository } from './repositories/location.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LocationSchemaClass.name, schema: LocationSchema },
    ]),
  ],
  providers: [
    {
      provide: LocationRepository,
      useClass: LocationDocumentRepository,
    },
  ],
  exports: [LocationRepository],
})
export class DocumentLocationPersistenceModule {}
