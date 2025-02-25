import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketRepository } from '../ticket.repository';
import { TicketEntity } from './entities/ticket.entity';
import { TicketsRelationalRepository } from './repositories/ticket.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TicketEntity])],
  providers: [
    {
      provide: TicketRepository,
      useClass: TicketsRelationalRepository,
    },
  ],
  exports: [TicketRepository],
})
export class RelationalTicketPersistenceModule {}