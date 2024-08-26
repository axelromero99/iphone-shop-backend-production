import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AuditLogDocument = AuditLog & Document;

@Schema({ timestamps: true })
export class AuditLog {
  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  method: string;

  @Prop({ type: Object })
  body: Record<string, any>;

  @Prop()
  userId: string;

  @Prop({ type: Object })
  user: Record<string, any>;  // Aquí guardaremos el objeto de usuario completo

  @Prop({ type: Object })
  response: Record<string, any>;

  @Prop()
  error?: string;

  @Prop()
  statusCode?: number;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);