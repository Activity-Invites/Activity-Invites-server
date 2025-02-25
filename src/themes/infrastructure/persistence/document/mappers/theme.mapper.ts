import { Theme } from '@/themes/domain/theme';
import { ThemeSchemaClass } from '../entities/theme.schema';
import { Types } from 'mongoose';

export class ThemeDocumentMapper {
  static toDomain(document: ThemeSchemaClass): Theme {
    const domain = new Theme();
    domain.id = document._id.toString();
    domain.name = document.name;
    domain.description = document.description;
    domain.category = document.category;
    domain.tags = document.tags;
    domain.coverImage = document.coverImage;
    domain.isDeleted = document.isDeleted;
    domain.createdAt = document.createdAt;
    domain.updatedAt = document.updatedAt;
    domain.deletedAt = document.deletedAt;
    return domain;
  }

  static toDocument(domain: Theme): Partial<ThemeSchemaClass> {
    const document: any = {
      name: domain.name,
      description: domain.description,
      category: domain.category,
      tags: domain.tags,
      coverImage: domain.coverImage,
      isDeleted: domain.isDeleted,
    };

    if (domain.id) {
      document._id = new Types.ObjectId(domain.id);
    }

    if (domain.createdAt) {
      document.createdAt = domain.createdAt;
    }

    if (domain.updatedAt) {
      document.updatedAt = domain.updatedAt;
    }

    if (domain.deletedAt) {
      document.deletedAt = domain.deletedAt;
    }

    return document;
  }
}
