
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Product } from './product.schema';

export type SaleDocument = Sale & Document;

@Schema({ timestamps: true })
export class Sale {
  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Product' }] })
  products: Product[];

  @Prop({ required: true })
  totalAmountUSD: number;

  @Prop({ required: true })
  totalAmountARS: number;

  @Prop({ required: true, type: String, enum: ["efectivo", "tarjeta", "transferencia"] })
  paymentMethod: string;

  // @Prop()
  // cardDetails: string;

  // @Prop()
  // installments: number;

  // @Prop()
  // interestRate: number;

  @Prop({ default: false })
  isPartialPayment: boolean;

  @Prop()
  amountPaid: number;

  @Prop()
  remainingAmount: number;

  @Prop({ type: Object })
  phoneReceived: {
    model: String,
    percentage: Number,
    accesories: [String],
  };

  @Prop({ type: Object })
  customerInfo: Record<string, any>;

  @Prop()
  status: string;



}

export const SaleSchema = SchemaFactory.createForClass(Sale);