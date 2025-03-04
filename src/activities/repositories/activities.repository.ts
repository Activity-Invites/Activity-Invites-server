import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Activities } from '../domain/activities';
import { Themes } from '../../themes/domain/themes';
import { BaseRepository } from '../../utils/repository/base.repository';
import { DeepPartial } from '../../utils/types/deep-partial.type';

@Injectable()
export class ActivitiesRepository extends BaseRepository<any, Activities> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma, 'activities');
  }

  /**
   * 将Prisma模型映射为领域模型
   * @param prismaActivity - Prisma活动模型
   * @returns 活动领域模型
   */
  mapToDomainModel(prismaActivity: any): Activities {
    const activity = new Activities();
    activity.id = prismaActivity.id;
    activity.name = prismaActivity.name;
    activity.mainImage = prismaActivity.mainImage;
    activity.startTime = prismaActivity.startTime;
    activity.endTime = prismaActivity.endTime;
    
    // 设置主题（如果有）
    if (prismaActivity.theme) {
      const theme = new Themes();
      theme.id = prismaActivity.theme.id;
      theme.createdAt = prismaActivity.theme.createdAt;
      theme.updatedAt = prismaActivity.theme.updatedAt;
      activity.themeId = theme;
    }
    
    // 设置日期字段
    activity.createdAt = prismaActivity.createdAt;
    activity.updatedAt = prismaActivity.updatedAt;
    
    return activity;
  }

  /**
   * 将领域模型映射为Prisma模型
   * @param domainModel - 活动领域模型
   * @returns Prisma创建/更新数据
   */
  mapToPrismaModel(domainModel: Partial<Activities> | DeepPartial<Activities> | Omit<Activities, 'id' | 'createdAt' | 'updatedAt'>): any {
    const prismaModel: any = {};
    
    if (domainModel.name !== undefined) prismaModel.name = domainModel.name;
    if (domainModel.mainImage !== undefined) prismaModel.mainImage = domainModel.mainImage;
    if (domainModel.startTime !== undefined) prismaModel.startTime = domainModel.startTime;
    if (domainModel.endTime !== undefined) prismaModel.endTime = domainModel.endTime;
    
    // 处理关联
    if (domainModel.themeId !== undefined) {
      prismaModel.themeId = domainModel.themeId.id;
    }
    
    return prismaModel;
  }
}
