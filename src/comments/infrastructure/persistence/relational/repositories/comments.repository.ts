import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { commentsEntity } from '../entities/comments.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { comments } from '../../../../domain/comments';
import { commentsRepository } from '../../comments.repository';
import { commentsMapper } from '../mappers/comments.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class commentsRelationalRepository implements commentsRepository {
  constructor(
    @InjectRepository(commentsEntity)
    private readonly commentsRepository: Repository<commentsEntity>,
  ) {}

  async create(data: comments): Promise<comments> {
    const persistenceModel = commentsMapper.toPersistence(data);
    const newEntity = await this.commentsRepository.save(
      this.commentsRepository.create(persistenceModel),
    );
    return commentsMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<comments[]> {
    const entities = await this.commentsRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => commentsMapper.toDomain(entity));
  }

  async findById(id: comments['id']): Promise<NullableType<comments>> {
    const entity = await this.commentsRepository.findOne({
      where: { id },
    });

    return entity ? commentsMapper.toDomain(entity) : null;
  }

  async findByIds(ids: comments['id'][]): Promise<comments[]> {
    const entities = await this.commentsRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => commentsMapper.toDomain(entity));
  }

  async update(
    id: comments['id'],
    payload: Partial<comments>,
  ): Promise<comments> {
    const entity = await this.commentsRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.commentsRepository.save(
      this.commentsRepository.create(
        commentsMapper.toPersistence({
          ...commentsMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return commentsMapper.toDomain(updatedEntity);
  }

  async remove(id: comments['id']): Promise<void> {
    await this.commentsRepository.delete(id);
  }
}
