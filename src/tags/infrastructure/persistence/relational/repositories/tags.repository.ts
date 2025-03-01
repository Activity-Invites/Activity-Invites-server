import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { TagsEntity } from '../entities/tags.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Tags } from '../../../../domain/tags';
import { TagsRepository } from '../../tags.repository';
import { TagsMapper } from '../mappers/tags.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class TagsRelationalRepository implements TagsRepository {
  constructor(
    @InjectRepository(TagsEntity)
    private readonly tagsRepository: Repository<TagsEntity>,
  ) {}

  async create(data: Tags): Promise<Tags> {
    const persistenceModel = TagsMapper.toPersistence(data);
    const newEntity = await this.tagsRepository.save(
      this.tagsRepository.create(persistenceModel),
    );
    return TagsMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Tags[]> {
    const entities = await this.tagsRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => TagsMapper.toDomain(entity));
  }

  async findById(id: Tags['id']): Promise<NullableType<Tags>> {
    const entity = await this.tagsRepository.findOne({
      where: { id },
    });

    return entity ? TagsMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Tags['id'][]): Promise<Tags[]> {
    const entities = await this.tagsRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => TagsMapper.toDomain(entity));
  }

  async update(
    id: Tags['id'],
    payload: Partial<Tags>,
  ): Promise<Tags> {
    const entity = await this.tagsRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.tagsRepository.save(
      this.tagsRepository.create(
        TagsMapper.toPersistence({
          ...TagsMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return TagsMapper.toDomain(updatedEntity);
  }

  async remove(id: Tags['id']): Promise<void> {
    await this.tagsRepository.delete(id);
  }
}
