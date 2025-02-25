import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ActivityDocument } from '@/activities/infrastructure/persistence/document/entities/activity.schema';
import { UserSchemaClass } from '@/users/infrastructure/persistence/document/entities/user.schema';
import { TicketStatus } from '@/tickets/domain/ticket';

@Schema({
  timestamps: {
    createdAt: true,
    updatedAt: true,
  },
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class TicketSchemaClass {
  @Prop({ type: String, required: true })
  _id: string;

  @Prop({ type: ActivityDocument, required: true })
  activity: ActivityDocument;

  @Prop({ type: UserSchemaClass, required: true })
  user: UserSchemaClass;

  @Prop({
    type: String,
    enum: TicketStatus,
    default: TicketStatus.PENDING,
  })
  status: TicketStatus;

  @Prop({ type: Number })
  createdAt: number;

  @Prop({ type: Number })
  updatedAt: number;

  @Prop({ type: Number })
  deletedAt?: number;

  @Prop({ required: false })
  joinTime?: Date;

  @Prop({ required: false })
  cancelTime?: Date;

  @Prop({ default: false })
  isDeleted: boolean;
}

export type TicketDocument = TicketSchemaClass & Document;
export const TicketSchema = SchemaFactory.createForClass(TicketSchemaClass);
