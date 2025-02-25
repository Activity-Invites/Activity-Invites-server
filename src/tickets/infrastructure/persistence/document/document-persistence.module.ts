import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TicketRepository } from '../ticket.repository';
import { TicketSchemaClass, TicketSchema } from './entities/ticket.schema';
import { TicketsDocumentRepository } from './repositories/ticket.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TicketSchemaClass.name, schema: TicketSchema },
    ]),
  ],
  providers: [
    {
      provide: TicketRepository,
      useClass: TicketsDocumentRepository,
    },
  ],
  exports: [TicketRepository],
})
export class DocumentTicketPersistenceModule {}