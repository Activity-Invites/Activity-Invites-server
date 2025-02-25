import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, In as InOperator } from 'typeorm';
import { NullableType } from '@/utils/types/nullable.type';
import { IPaginationOptions } from '@/utils/types/pagination-options';
import { Theme } from '@/themes/domain/theme';
import { FilterThemeDto, SortThemeDto } from '@/themes/dto/query-theme.dto';
import { ThemeEntity } from '../entities/theme.entity';
import { ThemeMapper } from '../mappers/theme.mapper';
import { ThemeRepository } from '../../theme.repository';

@Injectable()
export class RelationalThemeRepository implements ThemeRepository {
  constructor(
    @InjectRepository(ThemeEntity)
    private readonly themeRepository: Repository<ThemeEntity>,
  ) {}

  async create(
    data: Omit<Theme, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'>,
  ): Promise<Theme> {
    const persistenceEntity = ThemeMapper.toPersistence(data as Theme);
    const savedEntity = await this.themeRepository.save(persistenceEntity);
    return ThemeMapper.toDomain(savedEntity);
  }

  async findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterThemeDto | null;
    sortOptions?: SortThemeDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Theme[]> {
    const queryBuilder = this.themeRepository.createQueryBuilder('theme');

    // 添加关联
    queryBuilder.leftJoinAndSelect('theme.activities', 'activities');

    // 应用过滤条件
    if (filterOptions) {
      if (filterOptions.name) {
        queryBuilder.andWhere('theme.name ILIKE :name', {
          name: `%${filterOptions.name}%`,
        });
      }
      if (filterOptions.category) {
        queryBuilder.andWhere('theme.category = :category', {
          category: filterOptions.category,
        });
      }
      if (filterOptions.tags && filterOptions.tags.length > 0) {
        queryBuilder.andWhere('theme.tags && :tags', {
          tags: filterOptions.tags,
        });
      }
    }

    // 应用排序条件
    if (sortOptions && sortOptions.length > 0) {
      sortOptions.forEach((sort, index) => {
        const { orderBy, order } = sort;
        if (index === 0) {
          queryBuilder.orderBy(`theme.${orderBy}`, order);
        } else {
          queryBuilder.addOrderBy(`theme.${orderBy}`, order);
        }
      });
    } else {
      queryBuilder.orderBy('theme.createdAt', 'DESC');
    }

    // 应用分页
    const { page, limit } = paginationOptions;
    queryBuilder.skip((page - 1) * limit).take(limit);

    const entities = await queryBuilder.getMany();
    return entities.map((entity) => ThemeMapper.toDomain(entity));
  }

  async findById(id: Theme['id']): Promise<NullableType<Theme>> {
    const entity = await this.themeRepository.findOne({
      where: { id },
      relations: ['activities'],
    });
    return entity ? ThemeMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Theme['id'][]): Promise<Theme[]> {
    const entities = await this.themeRepository.find({
      where: { id: InOperator(ids) },
      relations: ['activities'],
    });
    return entities.map((entity) => ThemeMapper.toDomain(entity));
  }

  async findByName(name: string): Promise<Theme[]> {
    const entities = await this.themeRepository
      .createQueryBuilder('theme')
      .leftJoinAndSelect('theme.activities', 'activities')
      .where('theme.name ILIKE :name', { name: `%${name}%` })
      .getMany();
    return entities.map((entity) => ThemeMapper.toDomain(entity));
  }

  async findByCategory(category: string): Promise<Theme[]> {
    const entities = await this.themeRepository
      .createQueryBuilder('theme')
      .leftJoinAndSelect('theme.activities', 'activities')
      .where('theme.category = :category', { category })
      .getMany();
    return entities.map((entity) => ThemeMapper.toDomain(entity));
  }

  async update(
    id: Theme['id'],
    payload: Partial<Theme>,
  ): Promise<Theme | null> {
    const entity = await this.themeRepository.findOne({ where: { id } });
    if (!entity) {
      return null;
    }

    const updatedEntity = await this.themeRepository.save({
      ...entity,
      ...ThemeMapper.toPersistence(payload as Theme),
    });

    return ThemeMapper.toDomain(updatedEntity);
  }

  async softDelete(id: Theme['id']): Promise<void> {
    await this.themeRepository.softDelete(id);
  }

  async hardDelete(id: Theme['id']): Promise<void> {
    await this.themeRepository.delete(id);
  }

  async remove(id: Theme['id']): Promise<void> {
    await this.themeRepository.softDelete(id);
  }

  async count(): Promise<number> {
    return this.themeRepository.count();
  }
}
