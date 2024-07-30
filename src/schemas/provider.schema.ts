
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProviderDocument = Provider & Document;

@Schema({ timestamps: true })
export class Provider extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  cuit: string;

  @Prop()
  businessName: string;

  @Prop()
  debtStatus: string;

  @Prop()
  phone: string;

  @Prop()
  address: string;

  @Prop()
  email: string;

  @Prop([String])
  productCategories: string[];

  @Prop({ default: false })
  isDeleted: boolean;
}

export const ProviderSchema = SchemaFactory.createForClass(Provider);