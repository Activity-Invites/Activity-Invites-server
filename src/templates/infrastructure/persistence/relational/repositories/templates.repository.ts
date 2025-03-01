import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { TemplatesEntity } from '../entities/templates.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Templates } from '../../../../domain/templates';
import { TemplatesRepository } from '../../templates.repository';
import { TemplatesMapper } from '../mappers/templates.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class TemplatesRelationalRepository implements TemplatesRepository {
  constructor(
    @InjectRepository(TemplatesEntity)
    private readonly templatesRepository: Repository<TemplatesEntity>,
  ) {}

  async create(data: Templates): Promise<Templates> {
    const persistenceModel = TemplatesMapper.toPersistence(data);
    const newEntity = await this.templatesRepository.save(
      this.templatesRepository.create(persistenceModel),
    );
    return TemplatesMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Templates[]> {
    const entities = await this.templatesRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => TemplatesMapper.toDomain(entity));
  }

  async findById(id: Templates['id']): Promise<NullableType<Templates>> {
    const entity = await this.templatesRepository.findOne({
      where: { id },
    });

    return entity ? TemplatesMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Templates['id'][]): Promise<Templates[]> {
    const entities = await this.templatesRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => TemplatesMapper.toDomain(entity));
  }

  async update(
    id: Templates['id'],
    payload: Partial<Templates>,
  ): Promise<Templates> {
    const entity = await this.templatesRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.templatesRepository.save(
      this.templatesRepository.create(
        TemplatesMapper.toPersistence({
          ...TemplatesMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return TemplatesMapper.toDomain(updatedEntity);
  }

  async remove(id: Templates['id']): Promise<void> {
    await this.templatesRepository.delete(id);
  }
}
