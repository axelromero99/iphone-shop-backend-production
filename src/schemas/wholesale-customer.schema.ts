
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class WholesaleCustomer extends Document {
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

  @Prop()
  creditLimit: number;

  @Prop()
  paymentTerms: string;
}

export const WholesaleCustomerSchema = SchemaFactory.createForClass(WholesaleCustomer);