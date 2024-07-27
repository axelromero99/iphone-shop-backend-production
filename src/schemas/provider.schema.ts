
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
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
}

export const ProviderSchema = SchemaFactory.createForClass(Provider);