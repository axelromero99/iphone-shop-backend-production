import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type TransactionDocument = Transaction & Document;

@Schema({ timestamps: true })
export class Transaction {
  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  paymentMethod: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'CashRegister', required: true })
  cashRegister: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'CashClosing' })
  cashClosing: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, refPath: 'relatedDocumentType' })
  relatedDocument: mongoose.Types.ObjectId;

  @Prop({ required: true, enum: ['Sale', 'TechnicalService', 'Expense', 'Other'] })
  relatedDocumentType: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);