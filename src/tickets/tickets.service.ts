import { Injectable, NotFoundException } from '@nestjs/common';
import { TicketRepository } from './infrastructure/persistence/ticket.repository';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Ticket } from './domain/ticket';
import { FilterTicketDto, SortTicketDto } from './dto/query-ticket.dto';
import { IPaginationOptions } from '@/utils/types/pagination-options';

@Injectable()
export class TicketsService {
  constructor(private readonly ticketRepository: TicketRepository) {}

  async create(createTicketDto: CreateTicketDto): Promise<Ticket> {
    return this.ticketRepository.create(createTicketDto);
  }

  async findAll(options: {
    filterOptions?: FilterTicketDto;
    sortOptions?: SortTicketDto[];
    paginationOptions: IPaginationOptions;
  }): Promise<Ticket[]> {
    return this.ticketRepository.findManyWithPagination(options);
  }

  async findOne(id: string): Promise<Ticket> {
    const ticket = await this.ticketRepository.findById(id);
    if (!ticket) {
      throw new NotFoundException(`Ticket with ID "${id}" not found`);
    }
    return ticket;
  }

  async update(id: string, updateTicketDto: UpdateTicketDto): Promise<Ticket> {
    const updatedTicket = await this.ticketRepository.update(id, updateTicketDto);
    if (!updatedTicket) {
      throw new NotFoundException(`Ticket with ID "${id}" not found`);
    }
    return updatedTicket;
  }

  async remove(id: string): Promise<void> {
    const ticket = await this.ticketRepository.findById(id);
    if (!ticket) {
      throw new NotFoundException(`Ticket with ID "${id}" not found`);
    }
    await this.ticketRepository.remove(id);
  }

  async findByActivityId(activityId: string): Promise<Ticket[]> {
    return this.ticketRepository.findByActivityId(activityId);
  }

  async findByUserId(userId: string): Promise<Ticket[]> {
    return this.ticketRepository.findByUserId(userId);
  }

  async findByActivityIdAndUserId(
    activityId: string,
    userId: string,
  ): Promise<Ticket | null> {
    return this.ticketRepository.findByActivityIdAndUserId(activityId, userId);
  }
}
