import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { RelationalTicketPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { DocumentTicketPersistenceModule } from './infrastructure/persistence/document/document-persistence.module';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    process.env.DATABASE_TYPE === 'mongodb'
      ? DocumentTicketPersistenceModule
      : RelationalTicketPersistenceModule,
  ],
  controllers: [TicketsController],
  providers: [TicketsService, ConfigService],
  exports: [TicketsService],
})
export class TicketsModule {}
