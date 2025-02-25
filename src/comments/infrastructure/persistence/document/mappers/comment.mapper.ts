import { Comment } from '@/comments/domain/comment';
import { CommentSchemaClass } from '../entities/comment.schema';
import { Types } from 'mongoose';
import { ActivityDocumentMapper } from '@/activities/infrastructure/persistence/document/mappers/activity.mapper';
import { UserMapper } from '@/users/infrastructure/persistence/document/mappers/user.mapper';

export class CommentDocumentMapper {
  static toDomain(document: CommentSchemaClass): Comment {
    const domain = new Comment();
    domain.id = document._id.toString();
    domain.content = document.content;
    domain.isDeleted = document.isDeleted;
    domain.createdAt = document.createdAt;
    domain.updatedAt = document.updatedAt;
    domain.deletedAt = document.deletedAt;

    if (document.activity && typeof document.activity !== 'string') {
      domain.activity = ActivityDocumentMapper.toDomain(
        document.activity,
      );
    }

    if (document.user) {
      domain.user = UserMapper.toDomain(
        document.user,
      );
    }

    if (document.parent && typeof document.parent !== 'string') {
      const parentComment = new Comment();
      parentComment.id = document.parent.toString();
      parentComment.content = '';  // 设置必需字段的默认值
      parentComment.activity = domain.activity;  // 继承当前评论的活动
      parentComment.user = domain.user;  // 继承当前评论的用户
      parentComment.replies = [];  // 设置空的回复列表
      parentComment.createdAt = new Date();  // 设置默认时间
      parentComment.updatedAt = new Date();  // 设置默认时间
      domain.parent = parentComment;
    }

    if (document.replies) {
      domain.replies = document.replies.map(reply => {
        const replyComment = new Comment();
        replyComment.id = reply.toString();
        replyComment.content = '';  // 设置必需字段的默认值
        replyComment.activity = domain.activity;  // 继承当前评论的活动
        replyComment.user = domain.user;  // 继承当前评论的用户
        replyComment.replies = [];  // 设置空的回复列表
        replyComment.createdAt = new Date();  // 设置默认时间
        replyComment.updatedAt = new Date();  // 设置默认时间
        return replyComment;
      });
    }

    return domain;
  }

  static toDocument(domain: Comment): Partial<CommentSchemaClass> {
    const document: any = {
      content: domain.content,
      isDeleted: domain.isDeleted,
    };

    if (domain.id) {
      document._id = new Types.ObjectId(domain.id);
    }

    if (domain.activity) {
      document.activity = new Types.ObjectId(domain.activity.id);
    }

    if (domain.user) {
      document.user = new Types.ObjectId(domain.user.id);
    }

    if (domain.parent) {
      document.parent = new Types.ObjectId(domain.parent.id);
    }

    if (domain.replies) {
      document.replies = domain.replies.map(reply => 
        new Types.ObjectId(reply.id)
      );
    }

    return document;
  }
}
