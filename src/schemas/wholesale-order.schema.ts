
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class WholesaleOrder extends Document {
  @Prop({ type: Types.ObjectId, ref: 'WholesaleCustomer', required: true })
  customer: Types.ObjectId;

  @Prop([{
    product: { type: Types.ObjectId, ref: 'Product' },
    quantity: Number,
    price: Number
  }])
  items: Array<{ product: Types.ObjectId; quantity: number; price: number }>;

  @Prop({ required: true })
  totalAmount: number;

  @Prop()
  status: string;

  @Prop()
  paymentStatus: string;

  @Prop({ type: Date, default: Date.now })
  orderDate: Date;

  @Prop()
  deliveryDate: Date;

  @Prop()
  notes: string;
}

export const WholesaleOrderSchema = SchemaFactory.createForClass(WholesaleOrder);
