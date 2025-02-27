import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ticketsEntity } from '../entities/tickets.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { tickets } from '../../../../domain/tickets';
import { ticketsRepository } from '../../tickets.repository';
import { ticketsMapper } from '../mappers/tickets.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class ticketsRelationalRepository implements ticketsRepository {
  constructor(
    @InjectRepository(ticketsEntity)
    private readonly ticketsRepository: Repository<ticketsEntity>,
  ) {}

  async create(data: tickets): Promise<tickets> {
    const persistenceModel = ticketsMapper.toPersistence(data);
    const newEntity = await this.ticketsRepository.save(
      this.ticketsRepository.create(persistenceModel),
    );
    return ticketsMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<tickets[]> {
    const entities = await this.ticketsRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => ticketsMapper.toDomain(entity));
  }

  async findById(id: tickets['id']): Promise<NullableType<tickets>> {
    const entity = await this.ticketsRepository.findOne({
      where: { id },
    });

    return entity ? ticketsMapper.toDomain(entity) : null;
  }

  async findByIds(ids: tickets['id'][]): Promise<tickets[]> {
    const entities = await this.ticketsRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => ticketsMapper.toDomain(entity));
  }

  async update(id: tickets['id'], payload: Partial<tickets>): Promise<tickets> {
    const entity = await this.ticketsRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.ticketsRepository.save(
      this.ticketsRepository.create(
        ticketsMapper.toPersistence({
          ...ticketsMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return ticketsMapper.toDomain(updatedEntity);
  }

  async remove(id: tickets['id']): Promise<void> {
    await this.ticketsRepository.delete(id);
  }
}
