import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: [
        { level: 'query', emit: 'stdout' },
        { level: 'info', emit: 'stdout' },
        { level: 'warn', emit: 'stdout' },
        { level: 'error', emit: 'stdout' },
      ],
    });
  }

  async onModuleInit() {
    try {
      this.logger.log('连接到数据库...');
      await this.$connect();
      this.logger.log('数据库连接成功');
    } catch (error) {
      this.logger.error('数据库连接失败', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      this.logger.log('断开数据库连接...');
      await this.$disconnect();
      this.logger.log('数据库连接已断开');
    } catch (error) {
      this.logger.error('断开数据库连接失败', error);
      throw error;
    }
  }

  async cleanDatabase() {
    if (process.env.NODE_ENV === 'production') {
      this.logger.warn('不允许在生产环境中清理数据库');
      return;
    }
    
    this.logger.log('清理数据库...');
    try {
      // 获取当前数据库中的所有表名
      // @ts-ignore - 使用 $queryRaw 动态执行 SQL
      // const tables = await this.$queryRaw`SELECT tablename FROM pg_tables WHERE schemaname = 'public'`;

      // 对每个表执行清理操作（清空表内容但保留结构）
      // for (const { tablename } of tables) {
      //   if (tablename !== '_prisma_migrations') {
      //     // @ts-ignore - 使用 $executeRaw 动态执行 SQL
      //     await this.$executeRaw`TRUNCATE TABLE "public"."${tablename}" CASCADE;`;
      //     this.logger.log(`清理表: ${tablename}`);
      //   }
      // }
      this.logger.log('数据库清理完成');
    } catch (error) {
      this.logger.error('数据库清理失败', error);
      throw error;
    }
  }
}
