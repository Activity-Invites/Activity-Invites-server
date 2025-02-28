



import { ThemesSchemaClass } from '../../../../../themes/infrastructure/persistence/document/entities/themes.schema';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now, HydratedDocument } from 'mongoose';
import { EntityDocumentHelper } from '../../../../../utils/document-entity-helper';

export type ActivitiesSchemaDocument = HydratedDocument<ActivitiesSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class ActivitiesSchemaClass extends EntityDocumentHelper {
  @Prop({
    type:
              Date,
        })
  endTime: Date ;

  @Prop({
    type:
              Date,
        })
  startTime: Date ;

  @Prop({
    type:
              String,
        })
  mainImage?: string ;

  @Prop({
    type:
              String,
        })
  name?: string ;

  @Prop({
    type: ThemesSchemaClass,
  })
  themeId: ThemesSchemaClass;

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;
}

export const ActivitiesSchema = SchemaFactory.createForClass(
  ActivitiesSchemaClass,
);
