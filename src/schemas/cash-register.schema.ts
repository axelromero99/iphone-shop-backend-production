
// src/cash-register/schemas/cash-register.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class CashRegister extends Document {
  @Prop({ required: true })
  openingBalance: number;

  @Prop({ required: true })
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

  @Prop()
  notes: string;
}

export const CashRegisterSchema = SchemaFactory.createForClass(CashRegister);