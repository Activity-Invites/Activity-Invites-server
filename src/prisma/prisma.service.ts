import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
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
    }
  }

  async cleanDatabase() {
    if (process.env.NODE_ENV === 'production') {
      this.logger.warn('不允许在生产环境中清理数据库');
      return;
    }
    
    this.logger.log('清理数据库...');
    // 这里可以添加清理数据库的逻辑，用于测试环境
    const tables = ['user', 'role', 'status', 'file'];
    try {
      for (const table of tables) {
        if (this[table]) {
          // @ts-ignore - 动态访问表名
          await this[table].deleteMany();
        }
      }
      this.logger.log('数据库清理完成');
    } catch (error) {
      this.logger.error('数据库清理失败', error);
      throw error;
    }
  }
}
