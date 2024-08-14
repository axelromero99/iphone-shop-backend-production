import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { CashRegister } from './cash-register.schema';
import { Transaction } from './transaction.schema';

export type CashClosingDocument = CashClosing & Document;

@Schema({ timestamps: true })
export class CashClosing {
  @Prop({ type: Date, default: Date.now })
  closingDate: Date;

  @Prop({ required: true })
  totalSales: number;

  @Prop({ required: true })
  totalExpenses: number;

  @Prop({ required: true })
  netIncome: number;

  @Prop({ required: true })
  cashBalance: number;

  @Prop({ required: true })
  creditCardTotal: number;

  @Prop({ required: true })
  debitCardTotal: number;

  @Prop({ required: true })
  otherPaymentTotal: number;

  @Prop()
  notes: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CashRegister' }] })
  shifts: CashRegister[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }] })
  transactions: Transaction[];

  @Prop({ default: false })
  isDeleted: boolean;
}

export const CashClosingSchema = SchemaFactory.createForClass(CashClosing);