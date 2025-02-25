import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { ActivityStatus, ActivityType } from '@/activities/domain/activity';

@Schema({
  timestamps: true,
})
export class ActivityDocument extends Document {

  @Prop({ type: String, required: true })
  _id: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  mainImage: string;

  @Prop({ type: [String], default: [] })
  introImages: string[];

  @Prop({ type: Number, required: true })
  startTime: number;

  @Prop({ type: Number, required: true })
  endTime: number;

  @Prop({ required: true })
  location: string;

  @Prop({ default: false })
  isPublic: boolean;

  @Prop()
  description: string;

  @Prop({
    type: String,
    enum: ActivityStatus,
    default: ActivityStatus.DRAFT,
  })
  status: ActivityStatus;

  @Prop({
    type: String,
    enum: ActivityType,
    required: true,
  })
  type: ActivityType;

  @Prop({ default: 1 })
  minParticipants: number;

  @Prop()
  maxParticipants: number;

  @Prop({ default: 0 })
  waitingListLimit: number;

  @Prop({ default: 0 })
  currentParticipants: number;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  creator: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Theme' })
  theme: string;

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Ticket' }], default: [] })
  tickets: string[];

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Comment' }], default: [] })
  comments: string[];

  @Prop({ type: Number })
  createdAt: number;

  @Prop({ type: Number })
  updatedAt: number;

  @Prop({ type: Number })
  deletedAt?: number;
}

export const ActivitySchema = SchemaFactory.createForClass(ActivityDocument);
