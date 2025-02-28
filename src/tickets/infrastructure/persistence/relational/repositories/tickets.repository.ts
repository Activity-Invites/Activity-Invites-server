import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { TicketsEntity } from '../entities/tickets.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Tickets } from '../../../../domain/tickets';
import { TicketsRepository } from '../../tickets.repository';
import { TicketsMapper } from '../mappers/tickets.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class TicketsRelationalRepository implements TicketsRepository {
  constructor(
    @InjectRepository(TicketsEntity)
    private readonly ticketsRepository: Repository<TicketsEntity>,
  ) {}

  async create(data: Tickets): Promise<Tickets> {
    const persistenceModel = TicketsMapper.toPersistence(data);
    const newEntity = await this.ticketsRepository.save(
      this.ticketsRepository.create(persistenceModel),
    );
    return TicketsMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
    }): Promise<Tickets[]> {
    const entities = await this.ticketsRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => TicketsMapper.toDomain(entity));
  }

  async findById(id: Tickets['id']): Promise<NullableType<Tickets>> {
    const entity = await this.ticketsRepository.findOne({
      where: { id },
    });

    return entity ? TicketsMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Tickets['id'][]): Promise<Tickets[]> {
    const entities = await this.ticketsRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => TicketsMapper.toDomain(entity));
  }

  async update(id: Tickets['id'], payload: Partial<Tickets>): Promise<Tickets> {
    const entity = await this.ticketsRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.ticketsRepository.save(
      this.ticketsRepository.create(
        TicketsMapper.toPersistence({
          ...TicketsMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return TicketsMapper.toDomain(updatedEntity);
  }

  async remove(id: Tickets['id']): Promise<void> {
    await this.ticketsRepository.delete(id);
  }
}
