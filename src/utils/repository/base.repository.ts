import { PrismaService } from '../../prisma/prisma.service';
import { NullableType } from '../types/nullable.type';
import { IPaginationOptions } from '../types/pagination-options';
import { DeepPartial } from '../types/deep-partial.type';

/**
 * 基础仓库抽象类
 * @template T - Prisma模型类型
 * @template U - 领域模型类型
 * @template K - ID类型（默认为string）
 */
export abstract class BaseRepository<T, U, K = string> {
  /**
   * 构造函数
   * @param prisma - Prisma服务
   * @param modelName - Prisma模型名称
   */
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly modelName: string,
  ) {}

  /**
   * 创建新记录
   * @param data - 创建数据（不包含id、createdAt、updatedAt）
   * @returns 创建的领域模型实例
   */
  async create(data: Omit<U, 'id' | 'createdAt' | 'updatedAt'>): Promise<U> {
    const createData = this.mapToPrismaModel(data);
    
    // @ts-ignore - 动态访问Prisma模型
    const createdEntity = await this.prisma[this.modelName].create({
      data: createData,
    });

    return this.mapToDomainModel(createdEntity);
  }

  /**
   * 分页查询所有记录
   * @param options - 分页选项
   * @param include - 关联包含选项
   * @returns 领域模型实例数组
   */
  async findAllWithPagination({
    paginationOptions,
    include = {},
  }: {
    paginationOptions: IPaginationOptions;
    include?: Record<string, boolean>;
  }): Promise<U[]> {
    const { page, limit } = paginationOptions;
    const skip = (page - 1) * limit;

    // @ts-ignore - 动态访问Prisma模型
    const entities = await this.prisma[this.modelName].findMany({
      skip,
      take: limit,
      include,
    });

    return entities.map((entity) => this.mapToDomainModel(entity));
  }

  /**
   * 根据ID查找记录
   * @param id - 记录ID
   * @param include - 关联包含选项
   * @returns 领域模型实例 或 null
   */
  async findById(id: K, include: Record<string, boolean> = {}): Promise<NullableType<U>> {
    if (!id) return null;

    try {
      // @ts-ignore - 动态访问Prisma模型
      const entity = await this.prisma[this.modelName].findUnique({
        where: { id: id as any },
        include,
      });

      if (!entity) return null;

      return this.mapToDomainModel(entity);
    } catch (error) {
      return null;
    }
  }

  /**
   * 根据多个ID查找记录
   * @param ids - 记录ID数组
   * @param include - 关联包含选项
   * @returns 领域模型实例数组
   */
  async findByIds(ids: K[], include: Record<string, boolean> = {}): Promise<U[]> {
    if (!ids.length) return [];

    // @ts-ignore - 动态访问Prisma模型
    const entities = await this.prisma[this.modelName].findMany({
      where: {
        id: {
          in: ids as any[],
        },
      },
      include,
    });

    return entities.map((entity) => this.mapToDomainModel(entity));
  }

  /**
   * 更新记录
   * @param id - 记录ID
   * @param payload - 更新数据
   * @param include - 关联包含选项
   * @returns 更新后的领域模型实例 或 null
   */
  async update(
    id: K,
    payload: DeepPartial<U>,
    include: Record<string, boolean> = {},
  ): Promise<U | null> {
    if (!id) return null;

    const updateData = this.mapToPrismaModel(payload);

    try {
      // @ts-ignore - 动态访问Prisma模型
      const updatedEntity = await this.prisma[this.modelName].update({
        where: { id: id as any },
        data: updateData,
        include,
      });

      return this.mapToDomainModel(updatedEntity);
    } catch (error) {
      if (error.code === 'P2025') {
        return null;
      }
      throw error;
    }
  }

  /**
   * 删除记录
   * @param id - 记录ID
   */
  async remove(id: K): Promise<void> {
    if (!id) return;

    try {
      // @ts-ignore - 动态访问Prisma模型
      await this.prisma[this.modelName].delete({
        where: { id: id as any },
      });
    } catch (error) {
      // 如果记录不存在，忽略错误
      if (error.code !== 'P2025') {
        throw error;
      }
    }
  }

  /**
   * 自定义条件查找记录
   * @param where - 查询条件
   * @param include - 关联包含选项
   * @returns 领域模型实例数组
   */
  async findMany(where: any, include: Record<string, boolean> = {}): Promise<U[]> {
    // @ts-ignore - 动态访问Prisma模型
    const entities = await this.prisma[this.modelName].findMany({
      where,
      include,
    });

    return entities.map((entity) => this.mapToDomainModel(entity));
  }

  /**
   * 计算符合条件的记录数量
   * @param where - 查询条件
   * @returns 记录数量
   */
  async count(where: any = {}): Promise<number> {
    // @ts-ignore - 动态访问Prisma模型
    return this.prisma[this.modelName].count({ where });
  }

  /**
   * 抽象方法：将Prisma模型映射为领域模型
   * @param entity - Prisma模型实例
   * @returns 领域模型实例
   */
  abstract mapToDomainModel(entity: T): U;

  /**
   * 抽象方法：将领域模型映射为Prisma模型
   * @param domainModel - 领域模型实例或部分领域模型或排除了某些属性的模型
   * @returns Prisma创建/更新数据
   */
  abstract mapToPrismaModel(domainModel: Partial<U> | DeepPartial<U> | Omit<U, 'id' | 'createdAt' | 'updatedAt'>): any;
}
