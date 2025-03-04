import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NullableType } from '../../utils/types/nullable.type';
import { Tickets } from '../domain/tickets';
import { IPaginationOptions } from '../../utils/types/pagination-options';
import { DeepPartial } from '../../utils/types/deep-partial.type';

@Injectable()
export class TicketsRepository {
  constructor(private prisma: PrismaService) {}

  async create(
    data: Omit<Tickets, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Tickets> {
    const createdTicket = await this.prisma.tickets.create({
      data: {
        // 添加票务的必要字段，根据schema.prisma进行适配
      },
    });

    return this.mapToDomainModel(createdTicket);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Tickets[]> {
    const { page, limit } = paginationOptions;
    const skip = (page - 1) * limit;

    const tickets = await this.prisma.tickets.findMany({
      skip,
      take: limit,
    });

    return tickets.map((ticket) => this.mapToDomainModel(ticket));
  }

  async findById(id: Tickets['id']): Promise<NullableType<Tickets>> {
    if (!id) return null;

    const ticket = await this.prisma.tickets.findUnique({
      where: { id: id as string },
    });

    if (!ticket) return null;

    return this.mapToDomainModel(ticket);
  }

  async findByIds(ids: Tickets['id'][]): Promise<Tickets[]> {
    if (!ids.length) return [];

    const tickets = await this.prisma.tickets.findMany({
      where: {
        id: {
          in: ids as string[],
        },
      },
    });

    return tickets.map((ticket) => this.mapToDomainModel(ticket));
  }

  async update(
    id: Tickets['id'],
    payload: DeepPartial<Tickets>,
  ): Promise<Tickets | null> {
    if (!id) return null;

    // 从 payload 中提取需要更新的字段
    const updateData: any = {};
    // 根据 Tickets 域模型添加字段更新逻辑

    try {
      const updatedTicket = await this.prisma.tickets.update({
        where: { id: id as string },
        data: updateData,
      });

      return this.mapToDomainModel(updatedTicket);
    } catch (error) {
      if (error.code === 'P2025') {
        return null;
      }
      throw error;
    }
  }

  async remove(id: Tickets['id']): Promise<void> {
    if (!id) return;

    await this.prisma.tickets.delete({
      where: { id: id as string },
    });
  }

  // 将 Prisma 模型映射为领域模型
  private mapToDomainModel(prismaTicket: any): Tickets {
    const ticket = new Tickets();
    ticket.id = prismaTicket.id;
    // 根据 Tickets 域模型添加其他字段
    
    // 设置日期字段
    ticket.createdAt = prismaTicket.createdAt;
    ticket.updatedAt = prismaTicket.updatedAt;
    
    return ticket;
  }
}
