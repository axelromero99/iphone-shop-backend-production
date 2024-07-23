
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
// import { InventoryItem } from '../../inventory/schemas/inventory-item.schema';

export type TechnicalServiceDocument = TechnicalService & Document;

@Schema({ timestamps: true })
export class TechnicalService {
  @Prop({ required: true })
  deviceModel: string;

  @Prop({ required: true })
  issueDescription: string;

  @Prop()
  imei: string;

  @Prop()
  unlockPin: string;

  @Prop()
  capacity: string;

  @Prop()
  color: string;

  // @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'InventoryItem' }] })
  // usedItems: InventoryItem[];

  @Prop({ required: true })
  repairCost: number;

  @Prop({ default: false })
  hasWarranty: boolean;

  @Prop({ type: Object })
  customerInfo: Record<string, any>;

  @Prop({ type: [String] })
  repairImages: string[];

  @Prop({ required: true })
  status: string;

  @Prop()
  completionDate: Date;

  @Prop()
  trackingCode: string;
}

export const TechnicalServiceSchema = SchemaFactory.createForClass(TechnicalService);