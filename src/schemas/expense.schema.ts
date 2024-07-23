
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Expense extends Document {
  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  category: string;

  @Prop({ type: Date, default: Date.now })
  date: Date;

  @Prop()
  paymentMethod: string;

  @Prop()
  receipt: string;

  @Prop()
  notes: string;

  @Prop({ required: true })
  isRecurring: boolean;

  @Prop()
  recurrenceInterval: string;
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);