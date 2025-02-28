import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CommentsEntity } from '../entities/comments.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Comments } from '../../../../domain/comments';
import { CommentsRepository } from '../../comments.repository';
import { commentsMapper } from '../mappers/comments.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class CommentsRelationalRepository implements CommentsRepository {
  constructor(
    @InjectRepository(CommentsEntity)
    private readonly commentsRepository: Repository<CommentsEntity>,
  ) {}

  async create(data: Comments): Promise<Comments> {
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
  }): Promise<Comments[]> {
    const entities = await this.commentsRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => commentsMapper.toDomain(entity));
  }

  async findById(id: Comments['id']): Promise<NullableType<Comments>> {
    const entity = await this.commentsRepository.findOne({
      where: { id },
    });

    return entity ? commentsMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Comments['id'][]): Promise<Comments[]> {
    const entities = await this.commentsRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => commentsMapper.toDomain(entity));
  }

  async update(
    id: Comments['id'],
    payload: Partial<Comments>,
  ): Promise<Comments> {
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

  async remove(id: Comments['id']): Promise<void> {
    await this.commentsRepository.delete(id);
  }
}
