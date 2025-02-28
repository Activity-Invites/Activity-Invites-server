import { Injectable } from '@nestjs/common';
import { CreateticketsDto } from './dto/create-tickets.dto';
import { UpdateticketsDto } from './dto/update-tickets.dto';
import { TicketsRepository } from './infrastructure/persistence/tickets.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { tickets } from './domain/tickets';

@Injectable()
export class TicketsService {
  constructor(
    // Dependencies here
    private readonly ticketsRepository: TicketsRepository,
  ) {}

  async create(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createticketsDto: CreateticketsDto,
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

  findById(id: tickets['id']) {
    return this.ticketsRepository.findById(id);
  }

  findByIds(ids: tickets['id'][]) {
    return this.ticketsRepository.findByIds(ids);
  }

  async update(
    id: tickets['id'],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateticketsDto: UpdateticketsDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.ticketsRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
    });
  }

  remove(id: tickets['id']) {
    return this.ticketsRepository.remove(id);
  }
}
