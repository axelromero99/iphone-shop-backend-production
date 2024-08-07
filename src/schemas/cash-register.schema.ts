
// src/cash-register/schemas/cash-register.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Transaction } from './transaction.schema';

export type CashRegisterDocument = CashRegister & Document;

@Schema({ timestamps: true })
export class CashRegister {
  @Prop({ required: true })
  openingBalance: number;

  @Prop()
  closingBalance: number;

  @Prop()
  cashInDrawer: number;

  @Prop()
  creditCardTotal: number;

  @Prop()
  debitCardTotal: number;

  @Prop()
  otherPaymentTotal: number;

  @Prop()
  discrepancy: number;

  @Prop({ type: Date, default: Date.now })
  openingTime: Date;

  @Prop()
  closingTime: Date;

  @Prop({ required: true })
  cashier: string;

  @Prop({ enum: ['morning', 'afternoon'], required: true })
  shift: string;

  @Prop()
  notes: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }] })
  transactions: Transaction[];

  @Prop({ default: false })
  isClosed: boolean;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const CashRegisterSchema = SchemaFactory.createForClass(CashRegister);