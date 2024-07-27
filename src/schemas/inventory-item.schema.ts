
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type InventoryItemDocument = InventoryItem & Document;

@Schema({ timestamps: true })
export class InventoryItem {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  costPrice: number;

  @Prop({ required: true })
  sellingPrice: number;

  @Prop()
  provider: string;

  @Prop()
  sku: string;

  @Prop()
  location: string;

  @Prop({ type: Object })
  attributes: Record<string, any>;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const InventoryItemSchema = SchemaFactory.createForClass(InventoryItem);