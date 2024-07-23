
// src/products/schemas/product.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema()
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  priceUSD: number;

  @Prop({ required: true })
  priceARS: number;

  @Prop({ default: 0 })
  stock: number;

  @Prop()
  imei: string;

  @Prop()
  capacity: string;

  @Prop()
  color: string;

  @Prop({ default: false })
  isUsed: boolean;

  @Prop()
  condition: string;

  @Prop({ type: [String] })
  images: string[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);