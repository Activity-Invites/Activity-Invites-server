import { themesSchemaClass } from '../../../../../themes/infrastructure/persistence/document/entities/themes.schema';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now, HydratedDocument } from 'mongoose';
import { EntityDocumentHelper } from '../../../../../utils/document-entity-helper';

export type activitiesSchemaDocument = HydratedDocument<activitiesSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class activitiesSchemaClass extends EntityDocumentHelper {
  @Prop({
    type: themesSchemaClass,
  })
  themeId: themesSchemaClass;

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;
}

export const activitiesSchema = SchemaFactory.createForClass(
  activitiesSchemaClass,
);
