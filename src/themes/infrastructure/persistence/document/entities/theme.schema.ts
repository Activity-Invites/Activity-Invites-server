import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Activity } from '@/activities/domain/activity';

@Schema({
  collection: 'themes',
  timestamps: true,
})
export class ThemeSchemaClass extends Document {

  @Prop({ type: String, required: true })
  _id: string;


  @Prop({
    type: String,
    required: true,
    maxlength: 100,
  })
  name: string;

  @Prop({
    type: String,
    required: true,
  })
  description: string;

  @Prop({
    type: String,
    required: true,
    maxlength: 50,
  })
  category: string;

  @Prop({
    type: [String],
    default: [],
  })
  tags: string[];

  @Prop({
    type: String,
  })
  coverImage?: string;

  @Prop({
    type: Boolean,
    default: false,
  })
  isDeleted: boolean;

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Activity' }],
  })
  activities: Activity[];

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  deletedAt?: Date;
}

export const ThemeSchema = SchemaFactory.createForClass(ThemeSchemaClass);
