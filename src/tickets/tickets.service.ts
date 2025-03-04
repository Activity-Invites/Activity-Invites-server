import { Injectable } from '@nestjs/common';
import { CreateTicketsDto } from './dto/create-tickets.dto';
import { UpdateTicketsDto } from './dto/update-tickets.dto';
import { TicketsRepository } from './repositories/tickets.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Tickets } from './domain/tickets';

@Injectable()
export class TicketsService {
  constructor(
    // Dependencies here
    private readonly ticketsRepository: TicketsRepository,
  ) {}

  async create(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createTicketsDto: CreateTicketsDto,
  ) {
    // Do not remove comment below.
    // <creating-property />

    return this.ticketsRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.ticketsRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Tickets['id']) {
    return this.ticketsRepository.findById(id);
  }

  findByIds(ids: Tickets['id'][]) {
    return this.ticketsRepository.findByIds(ids);
  }

  async update(
    id: Tickets['id'],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateTicketsDto: UpdateTicketsDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.ticketsRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
    });
  }

  remove(id: Tickets['id']) {
    return this.ticketsRepository.remove(id);
  }
}
