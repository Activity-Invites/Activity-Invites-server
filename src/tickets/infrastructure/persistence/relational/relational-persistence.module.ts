import { Module } from '@nestjs/common';
import { ticketsRepository } from '../tickets.repository';
import { ticketsRelationalRepository } from './repositories/tickets.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ticketsEntity } from './entities/tickets.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ticketsEntity])],
  providers: [
    {
      provide: ticketsRepository,
      useClass: ticketsRelationalRepository,
    },
  ],
  exports: [ticketsRepository],
})
export class RelationalticketsPersistenceModule {}
