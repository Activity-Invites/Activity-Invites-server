import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NullableType } from '../../utils/types/nullable.type';
import { Session } from '../domain/session';
import { User } from '../../users/domain/user';

@Injectable()
export class SessionRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: Session['id']): Promise<NullableType<Session>> {
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
    
    const sessionData = await this.prisma.session.findUnique({
      where: { id: numericId },
      include: { user: true },
    });

    if (!sessionData) return null;

    return this.mapToDomainModel(sessionData);
  }

  async create(
    data: Omit<Session, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
  ): Promise<Session> {
    const userId = typeof data.user.id === 'string' 
      ? parseInt(data.user.id, 10) 
      : data.user.id;

    const sessionData = await this.prisma.session.create({
      data: {
        hash: data.hash,
        userId: userId,
      },
      include: { user: true },
    });

    return this.mapToDomainModel(sessionData);
  }

  async update(
    id: Session['id'],
    payload: Partial<
      Omit<Session, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
    >,
  ): Promise<Session | null> {
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
    
    // 准备更新数据
    const updateData: any = {};
    if (payload.hash !== undefined) updateData.hash = payload.hash;
    if (payload.user !== undefined) {
      const userId = typeof payload.user.id === 'string'
        ? parseInt(payload.user.id, 10)
        : payload.user.id;
      
      updateData.userId = userId;
    }

    try {
      const updatedSession = await this.prisma.session.update({
        where: { id: numericId },
        data: updateData,
        include: { user: true },
      });

      return this.mapToDomainModel(updatedSession);
    } catch (error) {
      if (error.code === 'P2025') {
        return null;
      }
      throw error;
    }
  }

  async deleteById(id: Session['id']): Promise<void> {
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
    
    await this.prisma.session.delete({
      where: { id: numericId },
    });
  }

  async deleteByUserId(conditions: { userId: User['id'] }): Promise<void> {
    const userId = typeof conditions.userId === 'string'
      ? parseInt(conditions.userId, 10)
      : conditions.userId;
    
    await this.prisma.session.deleteMany({
      where: { userId },
    });
  }

  async deleteByUserIdWithExclude(conditions: {
    userId: User['id'];
    excludeSessionId: Session['id'];
  }): Promise<void> {
    const userId = typeof conditions.userId === 'string'
      ? parseInt(conditions.userId, 10)
      : conditions.userId;
    
    const excludeSessionId = typeof conditions.excludeSessionId === 'string'
      ? parseInt(conditions.excludeSessionId, 10)
      : conditions.excludeSessionId;
    
    await this.prisma.session.deleteMany({
      where: {
        userId,
        id: { not: excludeSessionId },
      },
    });
  }

  // 将 Prisma 模型映射为领域模型
  private mapToDomainModel(prismaSession: any): Session {
    const session = new Session();
    session.id = prismaSession.id;
    session.hash = prismaSession.hash;
    
    // 设置用户
    if (prismaSession.user) {
      session.user = {
        id: prismaSession.user.id,
        email: prismaSession.user.email,
        firstName: prismaSession.user.firstName,
        lastName: prismaSession.user.lastName,
        provider: prismaSession.user.provider,
        socialId: prismaSession.user.socialId,
      } as User;
    }
    
    // 设置日期字段
    session.createdAt = prismaSession.createdAt;
    session.updatedAt = prismaSession.updatedAt;
    session.deletedAt = prismaSession.deletedAt;
    
    return session;
  }
}
