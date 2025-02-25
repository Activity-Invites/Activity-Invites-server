import { Injectable, NotFoundException } from '@nestjs/common';
import { ThemeRepository } from './infrastructure/persistence/theme.repository';
import { CreateThemeDto } from './dto/create-theme.dto';
import { UpdateThemeDto } from './dto/update-theme.dto';
import { Theme } from './domain/theme';
import { FilterThemeDto, SortThemeDto } from './dto/query-theme.dto';
import { IPaginationOptions } from '@/utils/types/pagination-options';

@Injectable()
export class ThemesService {
  constructor(private readonly themeRepository: ThemeRepository) {}

  async create(createThemeDto: CreateThemeDto): Promise<Theme> {
    return this.themeRepository.create({
      ...createThemeDto,
      tags: createThemeDto.tags || [],
      isDeleted: createThemeDto.isDeleted ?? false,
    });
  }

  async findAll(options: {
    filterOptions?: FilterThemeDto;
    sortOptions?: SortThemeDto[];
    paginationOptions: IPaginationOptions;
  }): Promise<Theme[]> {
    return this.themeRepository.findManyWithPagination(options);
  }

  async findOne(id: string): Promise<Theme> {
    const theme = await this.themeRepository.findById(id);
    if (!theme) {
      throw new NotFoundException(`Theme with ID "${id}" not found`);
    }
    return theme;
  }

  async update(id: string, updateThemeDto: UpdateThemeDto): Promise<Theme> {
    const updatedTheme = await this.themeRepository.update(id, updateThemeDto);
    if (!updatedTheme) {
      throw new NotFoundException(`Theme with ID "${id}" not found`);
    }
    return updatedTheme;
  }

  async remove(id: string): Promise<void> {
    const theme = await this.themeRepository.findById(id);
    if (!theme) {
      throw new NotFoundException(`Theme with ID "${id}" not found`);
    }
    await this.themeRepository.remove(id);
  }

  async findByName(name: string): Promise<Theme[]> {
    return this.themeRepository.findByName(name);
  }

  async findByCategory(category: string): Promise<Theme[]> {
    return this.themeRepository.findByCategory(category);
  }
}
