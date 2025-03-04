import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NullableType } from '../../utils/types/nullable.type';
import { Themes } from '../domain/themes';
import { IPaginationOptions } from '../../utils/types/pagination-options';
import { DeepPartial } from '../../utils/types/deep-partial.type';

@Injectable()
export class ThemesRepository {
  constructor(private prisma: PrismaService) {}

  async create(
    data: Omit<Themes, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Themes> {
    const createdTheme = await this.prisma.themes.create({
      data: {
        // 添加主题的必要字段，根据schema.prisma进行适配
      },
    });

    return this.mapToDomainModel(createdTheme);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Themes[]> {
    const { page, limit } = paginationOptions;
    const skip = (page - 1) * limit;

    const themes = await this.prisma.themes.findMany({
      skip,
      take: limit,
    });

    return themes.map((theme) => this.mapToDomainModel(theme));
  }

  async findById(id: Themes['id']): Promise<NullableType<Themes>> {
    if (!id) return null;

    const theme = await this.prisma.themes.findUnique({
      where: { id: id as string },
    });

    if (!theme) return null;

    return this.mapToDomainModel(theme);
  }

  async findByIds(ids: Themes['id'][]): Promise<Themes[]> {
    if (!ids.length) return [];

    const themes = await this.prisma.themes.findMany({
      where: {
        id: {
          in: ids as string[],
        },
      },
    });

    return themes.map((theme) => this.mapToDomainModel(theme));
  }

  async update(
    id: Themes['id'],
    payload: DeepPartial<Themes>,
  ): Promise<Themes | null> {
    if (!id) return null;

    // 从 payload 中提取需要更新的字段
    const updateData: any = {};
    // 根据 Themes 域模型添加字段更新逻辑

    try {
      const updatedTheme = await this.prisma.themes.update({
        where: { id: id as string },
        data: updateData,
      });

      return this.mapToDomainModel(updatedTheme);
    } catch (error) {
      if (error.code === 'P2025') {
        return null;
      }
      throw error;
    }
  }

  async remove(id: Themes['id']): Promise<void> {
    if (!id) return;

    await this.prisma.themes.delete({
      where: { id: id as string },
    });
  }

  // 将 Prisma 模型映射为领域模型
  private mapToDomainModel(prismaTheme: any): Themes {
    const theme = new Themes();
    theme.id = prismaTheme.id;
    // 根据 Themes 域模型添加其他字段
    
    // 设置日期字段
    theme.createdAt = prismaTheme.createdAt;
    theme.updatedAt = prismaTheme.updatedAt;
    
    return theme;
  }
}
