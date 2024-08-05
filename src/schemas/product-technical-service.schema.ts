
// src/products/schemas/product.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductTechnicalServiceDocument = ProductTechnicalService & Document;


@Schema({ timestamps: true })
export class ProductTechnicalService {
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

  @Prop({ default: false })
  isDeleted: boolean;
}

export const ProductTechnicalServiceSchema = SchemaFactory.createForClass(ProductTechnicalService);