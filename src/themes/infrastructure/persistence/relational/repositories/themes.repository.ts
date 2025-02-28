import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ThemesEntity } from '../entities/themes.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Themes } from '../../../../domain/themes';
import { ThemesRepository } from '../../themes.repository';
import { themesMapper } from '../mappers/themes.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class ThemesRelationalRepository implements ThemesRepository {
  constructor(
    @InjectRepository(ThemesEntity)
    private readonly themesRepository: Repository<ThemesEntity>,
  ) {}

  async create(data: Themes): Promise<Themes> {
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
  }): Promise<Themes[]> {
    const entities = await this.themesRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => themesMapper.toDomain(entity));
  }

  async findById(id: Themes['id']): Promise<NullableType<Themes>> {
    const entity = await this.themesRepository.findOne({
      where: { id },
    });

    return entity ? themesMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Themes['id'][]): Promise<Themes[]> {
    const entities = await this.themesRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => themesMapper.toDomain(entity));
  }

  async update(id: Themes['id'], payload: Partial<Themes>): Promise<Themes> {
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

  async remove(id: Themes['id']): Promise<void> {
    await this.themesRepository.delete(id);
  }
}
