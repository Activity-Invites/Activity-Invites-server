import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ticketsSchema, ticketsSchemaClass } from './entities/tickets.schema';
import { ticketsRepository } from '../tickets.repository';
import { ticketsDocumentRepository } from './repositories/tickets.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ticketsSchemaClass.name, schema: ticketsSchema },
    ]),
  ],
  providers: [
    {
      provide: ticketsRepository,
      useClass: ticketsDocumentRepository,
    },
  ],
  exports: [ticketsRepository],
})
export class DocumentticketsPersistenceModule {}
