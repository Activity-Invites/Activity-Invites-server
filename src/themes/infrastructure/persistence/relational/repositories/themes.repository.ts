import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { themesEntity } from '../entities/themes.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { themes } from '../../../../domain/themes';
import { themesRepository } from '../../themes.repository';
import { themesMapper } from '../mappers/themes.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class themesRelationalRepository implements themesRepository {
  constructor(
    @InjectRepository(themesEntity)
    private readonly themesRepository: Repository<themesEntity>,
  ) {}

  async create(data: themes): Promise<themes> {
    const persistenceModel = themesMapper.toPersistence(data);
    const newEntity = await this.themesRepository.save(
      this.themesRepository.create(persistenceModel),
    );
    return themesMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<themes[]> {
    const entities = await this.themesRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => themesMapper.toDomain(entity));
  }

  async findById(id: themes['id']): Promise<NullableType<themes>> {
    const entity = await this.themesRepository.findOne({
      where: { id },
    });

    return entity ? themesMapper.toDomain(entity) : null;
  }

  async findByIds(ids: themes['id'][]): Promise<themes[]> {
    const entities = await this.themesRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => themesMapper.toDomain(entity));
  }

  async update(id: themes['id'], payload: Partial<themes>): Promise<themes> {
    const entity = await this.themesRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.themesRepository.save(
      this.themesRepository.create(
        themesMapper.toPersistence({
          ...themesMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return themesMapper.toDomain(updatedEntity);
  }

  async remove(id: themes['id']): Promise<void> {
    await this.themesRepository.delete(id);
  }
}
