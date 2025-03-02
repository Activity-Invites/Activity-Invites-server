import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { User } from '../../../domain/user';
import { UserRepository } from '../user.repository';
import { IPaginationOptions } from '../../../../utils/types/pagination-options';
import { FilterUserDto, SortUserDto } from '../../../dto/query-user.dto';
import { NullableType } from '../../../../utils/types/nullable.type';
import { DeepPartial } from '../../../../utils/types/deep-partial.type';

@Injectable()
export class UserPrismaRepository implements UserRepository {
  constructor(private prisma: PrismaService) {}

  async create(
    data: Omit<User, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'>,
  ): Promise<User> {
    const createdUser = await this.prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        provider: data.provider,
        socialId: data.socialId,
        firstName: data.firstName,
        lastName: data.lastName,
        // 如果有 photo，将其 path 映射到 photoUrl
        photoUrl: data.photo?.path,
      },
    });

    return this.mapToDomainModel(createdUser);
  }

  async findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterUserDto | null;
    sortOptions?: SortUserDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<User[]> {
    const { page, limit } = paginationOptions;
    const skip = (page - 1) * limit;

    // 构建过滤条件
    const where: any = {};
    if (filterOptions?.roles?.length) {
      where.roleId = {
        in: filterOptions.roles.map((role) => role.id),
      };
    }

    // 构建排序条件
    const orderBy: any[] = [];
    if (sortOptions?.length) {
      sortOptions.forEach((sort) => {
        orderBy.push({
          [sort.orderBy]: sort.order,
        });
      });
    } else {
      // 默认排序
      orderBy.push({ id: 'asc' });
    }

    const users = await this.prisma.user.findMany({
      where,
      orderBy,
      skip,
      take: limit,
    });

    return users.map((user) => this.mapToDomainModel(user));
  }

  async findById(id: User['id']): Promise<NullableType<User>> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: typeof id === 'string' ? parseInt(id as string, 10) : (id as number),
      },
    });

    if (!user) return null;

    return this.mapToDomainModel(user);
  }

  async findByIds(ids: User['id'][]): Promise<User[]> {
    const numericIds = ids.map((id) => 
      typeof id === 'string' ? parseInt(id, 10) : id
    );

    const users = await this.prisma.user.findMany({
      where: {
        id: {
          in: numericIds,
        },
      },
    });

    return users.map((user) => this.mapToDomainModel(user));
  }

  async findByEmail(email: User['email']): Promise<NullableType<User>> {
    if (!email) return null;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) return null;

    return this.mapToDomainModel(user);
  }

  async findBySocialIdAndProvider({
    socialId,
    provider,
  }: {
    socialId: User['socialId'];
    provider: User['provider'];
  }): Promise<NullableType<User>> {
    if (!socialId || !provider) return null;

    const user = await this.prisma.user.findFirst({
      where: {
        socialId,
        provider,
      },
    });

    if (!user) return null;

    return this.mapToDomainModel(user);
  }

  async update(
    id: User['id'],
    payload: DeepPartial<User>,
  ): Promise<User | null> {
    // 处理 id 转换
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;

    // 从 payload 中提取需要更新的字段
    const updateData: any = {};
    if (payload.email !== undefined) updateData.email = payload.email;
    if (payload.password !== undefined) updateData.password = payload.password;
    if (payload.firstName !== undefined) updateData.firstName = payload.firstName;
    if (payload.lastName !== undefined) updateData.lastName = payload.lastName;
    if (payload.provider !== undefined) updateData.provider = payload.provider;
    if (payload.socialId !== undefined) updateData.socialId = payload.socialId;
    if (payload.photo?.path !== undefined) updateData.photoUrl = payload.photo.path;
    if (payload.role?.id !== undefined) updateData.roleId = payload.role.id;
    if (payload.status?.id !== undefined) updateData.statusId = payload.status.id;

    try {
      const updatedUser = await this.prisma.user.update({
        where: { id: numericId },
        data: updateData,
      });

      return this.mapToDomainModel(updatedUser);
    } catch (error) {
      // 如果用户不存在，Prisma 会抛出错误
      if (error.code === 'P2025') {
        return null;
      }
      throw error;
    }
  }

  async remove(id: User['id']): Promise<void> {
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
    
    await this.prisma.user.delete({
      where: { id: numericId },
    });
  }

  // 将 Prisma 模型映射为领域模型
  private mapToDomainModel(prismaUser: any): User {
    const user = new User();
    user.id = prismaUser.id;
    user.email = prismaUser.email;
    user.password = prismaUser.password;
    user.provider = prismaUser.provider;
    user.socialId = prismaUser.socialId;
    user.firstName = prismaUser.firstName;
    user.lastName = prismaUser.lastName;
    
    // 如果有 photoUrl，创建一个 photo 对象
    if (prismaUser.photoUrl) {
      user.photo = {
        path: prismaUser.photoUrl,
        // 其他字段可以根据需要设置
      } as any;
    }
    
    // 如果有 roleId，创建一个 role 对象
    if (prismaUser.roleId) {
      user.role = {
        id: prismaUser.roleId,
        // 其他字段可以根据需要设置
      } as any;
    }
    
    // 如果有 statusId，创建一个 status 对象
    if (prismaUser.statusId) {
      user.status = {
        id: prismaUser.statusId,
        // 其他字段可以根据需要设置
      } as any;
    }
    
    // 设置日期字段
    user.createdAt = prismaUser.createdAt;
    user.updatedAt = prismaUser.updatedAt;
    user.deletedAt = prismaUser.deletedAt;
    
    return user;
  }
}
