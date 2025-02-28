import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TicketsSchema, TicketsSchemaClass } from './entities/tickets.schema';
import { TicketsRepository } from '../tickets.repository';
import { TicketsDocumentRepository } from './repositories/tickets.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TicketsSchemaClass.name, schema: TicketsSchema },
    ]),
  ],
  providers: [
    {
      provide: TicketsRepository,
      useClass: TicketsDocumentRepository,
    },
  ],
  exports: [TicketsRepository],
})
export class DocumentTicketsPersistenceModule {}
