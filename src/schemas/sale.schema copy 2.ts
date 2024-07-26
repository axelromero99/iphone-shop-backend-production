import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Product } from './product.schema';

export type SaleDocument = Sale & Document;

@Schema({ timestamps: true })
export class Sale {
  @Prop({ type: Object, required: true })
  device: {
    model: string;
    color: string;
    capacity: string;
    IMEI: string;
  };

  @Prop({ type: Object, required: true })
  customer: {
    fullName: string;
    IDNumber: string;
    phone: string;
    email: string;
    address: string;
  };

  @Prop({ type: Object, required: true })
  payment: {
    price: string;
    totalAmountUSD: number;
    totalAmountARS: number;
    paymentMethod: string;
    downPaymentAmount: string;
    isDownPaymentMade: boolean;
    remainingAmount: string;
    isPartialPayment: boolean;
    amountPaid: number;
    paymentReceipt: string;
  };

  @Prop({ type: Object, required: true })
  status: {
    current: string;
    tracking: string;
  };

  @Prop({ required: true })
  entryDate: Date;

  @Prop({ required: true, unique: true })
  trackingCode: string;

  @Prop()
  observations: string;

  @Prop({ type: Object })
  received: {
    pesos: number;
    dollars: number;
    equipment: string;
  };

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Product' }] })
  products: Product[];

  @Prop({ type: Object })
  phoneReceived: {
    model: string;
    percentage: number;
    accessories: string[];
  };

  @Prop({ type: Object })
  customerInfo: Record<string, any>;
}

export const SaleSchema = SchemaFactory.createForClass(Sale);