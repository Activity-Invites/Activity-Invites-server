import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NullableType } from '../../utils/types/nullable.type';
import { Activities } from '../domain/activities';
import { IPaginationOptions } from '../../utils/types/pagination-options';
import { DeepPartial } from '../../utils/types/deep-partial.type';
import { Themes } from '../../themes/domain/themes';

@Injectable()
export class ActivitiesRepository {
  constructor(private prisma: PrismaService) {}

  async create(
    data: Omit<Activities, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Activities> {
    const createdActivity = await this.prisma.activities.create({
      data: {
        name: data.name,
        // 如果有themeId的关联关系，需要处理主题ID
        ...(data.themeId && { themeId: data.themeId.id }),
      },
    });

    return this.mapToDomainModel(createdActivity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Activities[]> {
    const { page, limit } = paginationOptions;
    const skip = (page - 1) * limit;

    const activities = await this.prisma.activities.findMany({
      skip,
      take: limit,
      // include: {
      //   theme: true, // 如果有主题关联，需要包含
      // },
    });

    return activities.map((activity) => this.mapToDomainModel(activity));
  }

  async findById(id: Activities['id']): Promise<NullableType<Activities>> {
    if (!id) return null;

    const activity = await this.prisma.activities.findUnique({
      where: { id: id as string },
      // include: {
      //   theme: true, // 如果有主题关联，需要包含
      // },
    });

    if (!activity) return null;

    return this.mapToDomainModel(activity);
  }

  async findByIds(ids: Activities['id'][]): Promise<Activities[]> {
    if (!ids.length) return [];

    const activities = await this.prisma.activities.findMany({
      where: {
        id: {
          in: ids as string[],
        },
      },
      // include: {
      //   theme: true, // 如果有主题关联，需要包含
      // },
    });

    return activities.map((activity) => this.mapToDomainModel(activity));
  }

  async update(
    id: Activities['id'],
    payload: DeepPartial<Activities>,
  ): Promise<Activities | null> {
    if (!id) return null;

    // 从 payload 中提取需要更新的字段
    const updateData: any = {};
    if (payload.name !== undefined) updateData.name = payload.name;
    if (payload.mainImage !== undefined) updateData.mainImage = payload.mainImage;
    if (payload.startTime !== undefined) updateData.startTime = payload.startTime;
    if (payload.endTime !== undefined) updateData.endTime = payload.endTime;
    if (payload.themeId !== undefined) {
      updateData.themeId = payload.themeId.id;
    }

    try {
      const updatedActivity = await this.prisma.activities.update({
        where: { id: id as string },
        data: updateData,
        // include: {
        //   theme: true, // 如果有主题关联，需要包含
        // },
      });

      return this.mapToDomainModel(updatedActivity);
    } catch (error) {
      if (error.code === 'P2025') {
        return null;
      }
      throw error;
    }
  }

  async remove(id: Activities['id']): Promise<void> {
    if (!id) return;

    await this.prisma.activities.delete({
      where: { id: id as string },
    });
  }

  // 将 Prisma 模型映射为领域模型
  private mapToDomainModel(prismaActivity: any): Activities {
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
      // 设置其他主题属性，根据需要添加
      activity.themeId = theme;
    }
    
    // 设置日期字段
    activity.createdAt = prismaActivity.createdAt;
    activity.updatedAt = prismaActivity.updatedAt;
    
    return activity;
  }
}
