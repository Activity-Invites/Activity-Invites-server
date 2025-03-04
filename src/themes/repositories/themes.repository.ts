import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Themes } from '../domain/themes';
import { BaseRepository } from '../../utils/repository/base.repository';
import { DeepPartial } from '../../utils/types/deep-partial.type';

@Injectable()
export class ThemesRepository extends BaseRepository<any, Themes> {
  constructor(prisma: PrismaService) {
    super(prisma, 'themes');
  }

  /**
   * 将Prisma模型映射为领域模型
   * @param prismaTheme - Prisma主题模型
   * @returns 主题领域模型
   */
  mapToDomainModel(prismaTheme: any): Themes {
    const theme = new Themes();
    theme.id = prismaTheme.id;
    // 根据您的数据库模型设置其他字段
    // theme.name = prismaTheme.name;
    // theme.description = prismaTheme.description;
    
    // 设置日期字段
    theme.createdAt = prismaTheme.createdAt;
    theme.updatedAt = prismaTheme.updatedAt;
    
    return theme;
  }

  /**
   * 将领域模型映射为Prisma模型
   * @param domainModel - 主题领域模型
   * @returns Prisma创建/更新数据
   */
  mapToPrismaModel(domainModel: Partial<Themes> | DeepPartial<Themes> | Omit<Themes, 'id' | 'createdAt' | 'updatedAt'>): any {
    const prismaModel: any = {};
    
    // 根据您的数据库模型设置字段
    // if (domainModel.name !== undefined) prismaModel.name = domainModel.name;
    // if (domainModel.description !== undefined) prismaModel.description = domainModel.description;
    
    return prismaModel;
  }
}
