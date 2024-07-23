import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model, Schema as MongooseSchema } from 'mongoose';
import { customAlphabet } from 'nanoid';
import { Diagnosis, DiagnosisSchema } from './diagnosis.schema';



const customAlphabetWithoutDashUnderscore = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', 11);



@Schema({ timestamps: true })
export class Record {
  @Prop({ required: true })
  model: string;

  @Prop()
  others: string;

  @Prop({ required: true })
  intakeReason: string;

  @Prop()
  details: string;

  @Prop()
  price: string;

  @Prop()
  instagram: string;

  @Prop()
  email: string;

  @Prop()
  remainingAmount: string;

  @Prop({ required: true })
  capacity: string;

  @Prop({ required: true })
  color: string;

  @Prop()
  downPayment: string;

  @Prop()
  downPaymentMade: boolean;

  @Prop()
  paymentMethod: string;

  @Prop([String])
  paymentStatus: string[];

  @Prop({ required: true })
  idNumber: string;

  @Prop({ required: true })
  trackingStatus: string;

  @Prop([String])
  images: string[];

  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  intakeDate: Date;

  @Prop()
  releaseDate: Date;

  @Prop({
    required: true,
    unique: true,
    default: () => customAlphabetWithoutDashUnderscore(),
  })
  trackingCode: string;

  @Prop({ required: true })
  imei: string;

  @Prop({ default: "No tiene" })
  pin: string;

  @Prop()
  remarks: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Diagnosis' })
  initialDiagnosis?: Diagnosis | null;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Diagnosis' })
  finalDiagnosis?: Diagnosis | null;

  @Prop()
  deviceWarranty: string;
}

export const RecordSchema = SchemaFactory.createForClass(Record);
// export const Registro: Model<IRecord> = mongoose.models.Registro || mongoose.model<IRecord>("Registro", RecordSchema);
