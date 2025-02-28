import { Module } from '@nestjs/common';
import { TicketsRepository } from '../tickets.repository';
import { TicketsRelationalRepository } from './repositories/tickets.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketsEntity } from './entities/tickets.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TicketsEntity])],
  providers: [
    {
      provide: TicketsRepository,
      useClass: TicketsRelationalRepository,
    },
  ],
  exports: [TicketsRepository],
})
export class RelationalticketsPersistenceModule {}
