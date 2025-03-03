// src/users/infrastructure/persistence/hybrid/repositories/user.repository.ts
import { Injectable, Inject } from '@nestjs/common';
import { UserRepository } from '../../user.repository';
import { UserPrismaRepository } from '../../prisma/repositories/user.repository';
import { UsersRelationalRepository } from '../../relational/repositories/user.repository';
import { User } from '../../../../domain/user';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { FilterUserDto, SortUserDto } from '../../../../dto/query-user.dto';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { DeepPartial } from '../../../../../utils/types/deep-partial.type';

@Injectable()
export class HybridUserRepository implements UserRepository {
  constructor(
    private readonly prismaRepository: UserPrismaRepository,
    private readonly relationalRepository: UsersRelationalRepository,
  ) {}

  // 使用Prisma进行简单的CRUD操作
  async create(data: Omit<User, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'>): Promise<User> {
    return this.prismaRepository.create(data);
  }

  async findById(id: User['id']): Promise<NullableType<User>> {
    return this.prismaRepository.findById(id);
  }

  async findByEmail(email: User['email']): Promise<NullableType<User>> {
    return this.prismaRepository.findByEmail(email);
  }

  async update(id: User['id'], payload: DeepPartial<User>): Promise<User | null> {
    return this.prismaRepository.update(id, payload);
  }

  async remove(id: User['id']): Promise<void> {
    return this.prismaRepository.remove(id);
  }

  // 对于可能涉及复杂查询的操作，使用Relational
  async findManyWithPagination(params: {
    filterOptions?: FilterUserDto | null;
    sortOptions?: SortUserDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<User[]> {
    try {
      // 尝试使用Prisma
      return await this.prismaRepository.findManyWithPagination(params);
    } catch (error) {
      // 如果Prisma查询失败，回退到TypeORM
      console.log('回退到Relational查询', error);
      return this.relationalRepository.findManyWithPagination(params);
    }
  }

  async findByIds(ids: User['id'][]): Promise<User[]> {
    return this.prismaRepository.findByIds(ids);
  }

  async findBySocialIdAndProvider(params: {
    socialId: User['socialId'];
    provider: User['provider'];
  }): Promise<NullableType<User>> {
    return this.prismaRepository.findBySocialIdAndProvider(params);
  }
}