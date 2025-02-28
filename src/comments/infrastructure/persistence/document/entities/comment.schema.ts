import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ActivityDocument } from '@/activities/infrastructure/persistence/document/entities/activity.schema';
import { UserSchemaClass } from '@/users/infrastructure/persistence/document/entities/user.schema';
import { EntityDocumentHelper } from '@/utils/document-entity-helper';

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class CommentSchemaClass extends EntityDocumentHelper {

  @Prop({ type: String, required: true })
  _id: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: ActivityDocument, required: true })
  activity: ActivityDocument;

  @Prop({ type: UserSchemaClass, required: true })
  user: UserSchemaClass;

  @Prop({ type: Types.ObjectId, ref: CommentSchemaClass.name })
  parent?: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: CommentSchemaClass.name }] })
  replies: Types.ObjectId[];

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  deletedAt?: Date;
}

export const CommentSchema = SchemaFactory.createForClass(CommentSchemaClass);
