import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NullableType } from '../../utils/types/nullable.type';
import { FileType } from '../domain/file';

@Injectable()
export class FileRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Omit<FileType, 'id'>): Promise<FileType> {
    const createdFile = await this.prisma.file.create({
      data: {
        path: data.path,
      },
    });

    return this.mapToDomainModel(createdFile);
  }

  async findById(id: FileType['id']): Promise<NullableType<FileType>> {
    if (!id) return null;

    const file = await this.prisma.file.findUnique({
      where: { id },
    });

    if (!file) return null;

    return this.mapToDomainModel(file);
  }

  async findByIds(ids: FileType['id'][]): Promise<FileType[]> {
    if (!ids.length) return [];

    const files = await this.prisma.file.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return files.map((file) => this.mapToDomainModel(file));
  }

  // 将 Prisma 模型映射为领域模型
  private mapToDomainModel(prismaFile: any): FileType {
    const file = new FileType();
    file.id = prismaFile.id;
    file.path = prismaFile.path;
    
    return file;
  }
}
