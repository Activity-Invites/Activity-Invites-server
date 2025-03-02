import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class PrismaExampleService {
  constructor(private prisma: PrismaService) {}

  // 查找所有用户
  async findAllUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  // 通过 ID 查找用户
  async findUserById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  // 创建用户
  async createUser(data: {
    email: string;
    firstName?: string;
    lastName?: string;
    password?: string;
  }): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  // 更新用户
  async updateUser(
    id: number,
    data: {
      email?: string;
      firstName?: string;
      lastName?: string;
    },
  ): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  // 删除用户
  async deleteUser(id: number): Promise<User> {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
