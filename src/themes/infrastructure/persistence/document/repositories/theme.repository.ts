import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NullableType } from '@/utils/types/nullable.type';
import { IPaginationOptions } from '@/utils/types/pagination-options';
import { Theme } from '@/themes/domain/theme';
import { FilterThemeDto, SortThemeDto } from '@/themes/dto/query-theme.dto';
import { ThemeSchemaClass } from '../entities/theme.schema';
import { ThemeDocumentMapper } from '../mappers/theme.mapper';
import { ThemeRepository } from '../../theme.repository';

@Injectable()
export class DocumentThemeRepository implements ThemeRepository {
  constructor(
    @InjectModel(ThemeSchemaClass.name)
    private readonly themeModel: Model<ThemeSchemaClass>,
  ) {}

  async create(
    data: Omit<Theme, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'>,
  ): Promise<Theme> {
    const document = ThemeDocumentMapper.toDocument(data as Theme);
    const createdDocument = await this.themeModel.create(document);
    return ThemeDocumentMapper.toDomain(createdDocument);
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
    const query: any = {};

    // 应用过滤条件
    if (filterOptions) {
      if (filterOptions.name) {
        query.name = { $regex: filterOptions.name, $options: 'i' };
      }
      if (filterOptions.category) {
        query.category = filterOptions.category;
      }
      if (filterOptions.tags && filterOptions.tags.length > 0) {
        query.tags = { $all: filterOptions.tags };
      }
    }

    // 构建排序条件
    const sort: any = {};
    if (sortOptions && sortOptions.length > 0) {
      sortOptions.forEach((sortOption) => {
        sort[sortOption.orderBy as string] = sortOption.order === 'ASC' ? 1 : -1;
      });
    } else {
      sort.createdAt = -1;
    }

    const { page, limit } = paginationOptions;
    const skip = (page - 1) * limit;

    const documents = await this.themeModel
      .find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('activities')
      .exec();

    return documents.map((doc) => ThemeDocumentMapper.toDomain(doc));
  }

  async findById(id: Theme['id']): Promise<NullableType<Theme>> {
    const document = await this.themeModel
      .findById(id)
      .populate('activities')
      .exec();
    return document ? ThemeDocumentMapper.toDomain(document) : null;
  }

  async findByIds(ids: Theme['id'][]): Promise<Theme[]> {
    const documents = await this.themeModel
      .find({ _id: { $in: ids } })
      .populate('activities')
      .exec();
    return documents.map((doc) => ThemeDocumentMapper.toDomain(doc));
  }

  async findByName(name: string): Promise<Theme[]> {
    const documents = await this.themeModel
      .find({ name: { $regex: name, $options: 'i' } })
      .populate('activities')
      .exec();
    return documents.map((doc) => ThemeDocumentMapper.toDomain(doc));
  }

  async findByCategory(category: string): Promise<Theme[]> {
    const documents = await this.themeModel
      .find({ category })
      .populate('activities')
      .exec();
    return documents.map((doc) => ThemeDocumentMapper.toDomain(doc));
  }

  async update(
    id: Theme['id'],
    payload: Partial<Theme>,
  ): Promise<Theme | null> {
    const document = await this.themeModel
      .findByIdAndUpdate(
        id,
        { $set: ThemeDocumentMapper.toDocument(payload as Theme) },
        { new: true },
      )
      .populate('activities')
      .exec();
    return document ? ThemeDocumentMapper.toDomain(document) : null;
  }

  async softDelete(id: Theme['id']): Promise<void> {
    await this.themeModel.findByIdAndUpdate(id, {
      $set: { deletedAt: new Date() },
    });
  }

  async hardDelete(id: Theme['id']): Promise<void> {
    await this.themeModel.findByIdAndDelete(id);
  }

  async remove(id: Theme['id']): Promise<void> {
    await this.themeModel.findByIdAndDelete(id);
  }

  async count(): Promise<number> {
    return this.themeModel.countDocuments();
  }
}
