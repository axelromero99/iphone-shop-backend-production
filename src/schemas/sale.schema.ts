import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Product } from './product.schema';
// import { customAlphabet } from 'nanoid';
import { generateTrackingCode } from '../utils/tracking-code.generator';


export type SaleDocument = Sale & Document;

@Schema({ timestamps: true })
export class Sale {

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
    totalPriceUSD: number;
    totalPriceARS: number;
    isPrepurchase: boolean;
    paymentDetails: [
      {
        method: string; // 'efectivo', 'dolares', 'transferencia'
        amountUSD: number;
        amountARS: number;
        date: Date;
        receipt: string; // Optional, for receipt number or reference
      }
    ],
    remainingAmountUSD: number;
    remainingAmountARS: number;
    isFullyPaid: boolean;
  };

  @Prop({ type: Object, required: true })
  status: {
    current: string;
    tracking: string;
  };

  @Prop({ required: true })
  entryDate: Date;

  @Prop({
    required: false,
    unique: true,
    default: generateTrackingCode
  })
  trackingCode: string;

  @Prop()
  observations: string;

  @Prop({ type: Object })
  received: {
    pesos: number;
    dollars: number;
    equipment: string;
  };

  @Prop([{
    product: { type: MongooseSchema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    // priceAtSaleUSD: { type: Number, required: true },
    // priceAtSaleARS: { type: Number, required: true }
  }])
  products: Array<{
    product: Product;
    quantity: number;
    // priceAtSaleUSD: number;
    // priceAtSaleARS: number;
  }>;
  @Prop({ type: Object })
  phoneReceived: {
    model: string;
    percentage: number;
    accessories: string[];
  };

  @Prop({ type: Object })
  customerInfo: Record<string, any>;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const SaleSchema = SchemaFactory.createForClass(Sale);


// Añade un pre-save hook para asegurarte de que trackingCode siempre tenga un valor
SaleSchema.pre('save', function (next) {
  if (!this.trackingCode) {
    this.trackingCode = generateTrackingCode();
  }
  next();
});