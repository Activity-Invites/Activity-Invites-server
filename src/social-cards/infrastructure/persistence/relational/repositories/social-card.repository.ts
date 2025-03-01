import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { SocialCardEntity } from '../entities/social-card.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { SocialCard } from '../../../../domain/social-card';
import { SocialCardRepository } from '../../social-card.repository';
import { SocialCardMapper } from '../mappers/social-card.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class SocialCardRelationalRepository implements SocialCardRepository {
  constructor(
    @InjectRepository(SocialCardEntity)
    private readonly socialCardRepository: Repository<SocialCardEntity>,
  ) {}

  async create(data: SocialCard): Promise<SocialCard> {
    const persistenceModel = SocialCardMapper.toPersistence(data);
    const newEntity = await this.socialCardRepository.save(
      this.socialCardRepository.create(persistenceModel),
    );
    return SocialCardMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<SocialCard[]> {
    const entities = await this.socialCardRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => SocialCardMapper.toDomain(entity));
  }

  async findById(id: SocialCard['id']): Promise<NullableType<SocialCard>> {
    const entity = await this.socialCardRepository.findOne({
      where: { id },
    });

    return entity ? SocialCardMapper.toDomain(entity) : null;
  }

  async findByIds(ids: SocialCard['id'][]): Promise<SocialCard[]> {
    const entities = await this.socialCardRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => SocialCardMapper.toDomain(entity));
  }

  async update(
    id: SocialCard['id'],
    payload: Partial<SocialCard>,
  ): Promise<SocialCard> {
    const entity = await this.socialCardRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.socialCardRepository.save(
      this.socialCardRepository.create(
        SocialCardMapper.toPersistence({
          ...SocialCardMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return SocialCardMapper.toDomain(updatedEntity);
  }

  async remove(id: SocialCard['id']): Promise<void> {
    await this.socialCardRepository.delete(id);
  }
}
