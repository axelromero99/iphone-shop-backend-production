import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Product } from './product.schema';
// import { customAlphabet } from 'nanoid';



// const customAlphabetWithoutDashUnderscore = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', 11);

export type SaleDocument = Sale & Document;

@Schema({ timestamps: true })
export class Sale {
  @Prop({ required: true })
  model: string;

  @Prop({ required: true })
  color: string;
  TechnicalService
  @Prop({ required: true })
  capacity: string;

  @Prop()
  downPaymentAmount: string;

  @Prop({ type: String, enum: ['efectivo', 'tarjeta', 'transferencia'] })
  paymentMethod: string;

  @Prop({ required: true })
  IDNumber: string;

  @Prop()
  paymentReceipt: string;

  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  status: string;

  @Prop({ required: true })
  trackingStatus: string;

  @Prop({ required: true })
  entryDate: Date;

  @Prop({
    required: true,
    unique: true,
    // default: () => customAlphabetWithoutDashUnderscore()
  })
  trackingCode: string;

  @Prop()
  IMEI: string;

  @Prop({ required: true })
  price: string;

  @Prop()
  isDownPaymentMade: boolean;

  @Prop()
  remainingAmount: string;

  @Prop()
  observations: string;

  @Prop()
  address: string;

  @Prop()
  email: string;

  @Prop()
  receivedPesos: number;

  @Prop()
  receivedDollars: number;

  @Prop()
  receivedEquipment: string;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Product' }] })
  products: Product[];

  @Prop({ required: true })
  totalAmountUSD: number;

  @Prop({ required: true })
  totalAmountARS: number;

  @Prop({ default: false })
  isPartialPayment: boolean;

  @Prop()
  amountPaid: number;

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