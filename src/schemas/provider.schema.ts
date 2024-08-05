import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Product } from './product.schema';

export type ProviderDocument = Provider & Document;

@Schema({ timestamps: true })
export class Provider {

  @Prop([{
    product: { type: MongooseSchema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    pricePerUnitUSD: { type: Number, required: true },
    pricePerUnitARS: { type: Number, required: true }
  }])
  products: Array<{
    product: Product;
    quantity: number;
    pricePerUnitUSD: number;
    pricePerUnitARS: number;
  }>;

  @Prop({ required: true })
  totalPriceUSD: number;

  @Prop({ required: true })
  totalPriceARS: number;

  @Prop({ type: Date, required: true })
  providerDate: Date;

  @Prop()
  invoiceNumber: string;

  @Prop()
  observations: string;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const ProviderSchema = SchemaFactory.createForClass(Provider);