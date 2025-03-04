import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NullableType } from '../../utils/types/nullable.type';
import { Comments } from '../domain/comments';
import { IPaginationOptions } from '../../utils/types/pagination-options';
import { DeepPartial } from '../../utils/types/deep-partial.type';

@Injectable()
export class CommentsRepository {
  constructor(private prisma: PrismaService) {}

  async create(
    data: Omit<Comments, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Comments> {
    const createdComment = await this.prisma.comments.create({
      data: {
        // 添加注释的所有必要字段
        // 目前comments模型比较简单，可以根据需求添加更多字段
      },
    });

    return this.mapToDomainModel(createdComment);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Comments[]> {
    const { page, limit } = paginationOptions;
    const skip = (page - 1) * limit;

    const comments = await this.prisma.comments.findMany({
      skip,
      take: limit,
      // 可以添加include以包含相关实体
    });

    return comments.map((comment) => this.mapToDomainModel(comment));
  }

  async findById(id: Comments['id']): Promise<NullableType<Comments>> {
    if (!id) return null;

    const comment = await this.prisma.comments.findUnique({
      where: { id: id as string },
      // 可以添加include以包含相关实体
    });

    if (!comment) return null;

    return this.mapToDomainModel(comment);
  }

  async findByIds(ids: Comments['id'][]): Promise<Comments[]> {
    if (!ids.length) return [];

    const comments = await this.prisma.comments.findMany({
      where: {
        id: {
          in: ids as string[],
        },
      },
      // 可以添加include以包含相关实体
    });

    return comments.map((comment) => this.mapToDomainModel(comment));
  }

  async update(
    id: Comments['id'],
    payload: DeepPartial<Comments>,
  ): Promise<Comments | null> {
    if (!id) return null;

    // 从 payload 中提取需要更新的字段
    const updateData: any = {};
    // 根据 Comments 域模型添加字段更新逻辑

    try {
      const updatedComment = await this.prisma.comments.update({
        where: { id: id as string },
        data: updateData,
        // 可以添加include以包含相关实体
      });

      return this.mapToDomainModel(updatedComment);
    } catch (error) {
      if (error.code === 'P2025') {
        return null;
      }
      throw error;
    }
  }

  async remove(id: Comments['id']): Promise<void> {
    if (!id) return;

    await this.prisma.comments.delete({
      where: { id: id as string },
    });
  }

  // 将 Prisma 模型映射为领域模型
  private mapToDomainModel(prismaComment: any): Comments {
    const comment = new Comments();
    comment.id = prismaComment.id;
    // 设置其他字段，根据 Comments 域模型添加
    
    // 设置日期字段
    comment.createdAt = prismaComment.createdAt;
    comment.updatedAt = prismaComment.updatedAt;
    
    return comment;
  }
}
