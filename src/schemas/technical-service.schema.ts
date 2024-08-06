import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { generateTrackingCode } from '../utils/tracking-code.generator';

// import { Document } from 'mongoose';
export type TechnicalServiceDocument = TechnicalService & Document;

export type SortOrder = -1 | 1;


@Schema({ timestamps: true })
export class Diagnosis {
  @Prop() description?: boolean;
  @Prop() screws?: boolean;
  @Prop() powerButton?: boolean;
  @Prop() charging?: boolean;
  @Prop() homeButton?: boolean;
  @Prop() touchFaceID?: boolean;
  @Prop() trueTone?: boolean;
  @Prop() flash?: boolean;
  @Prop() cameraT1?: boolean;
  @Prop() cameraT2?: boolean;
  @Prop() cameraT3?: boolean;
  @Prop() frontCamera?: boolean;
  @Prop() gyroscope?: boolean;
  @Prop() signal?: boolean;
  @Prop() imei?: boolean;
  @Prop() proxSensor?: boolean;
  @Prop() bottomSpeaker?: boolean;
  @Prop() topSpeaker?: boolean;
  @Prop() vibrator?: boolean;
  @Prop() volume?: boolean;
  @Prop() batteryCondition?: number;
  @Prop() wifi?: boolean;
  @Prop() microphone?: boolean;
  @Prop() silentSwitch?: boolean;
  @Prop() touch?: boolean;
  @Prop({ required: true }) diagnosisDate: Date;
}

@Schema({ timestamps: true })
export class UsedProduct {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'ProductTechnicalService', required: true })
  product: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  quantity: number;
}

@Schema({ timestamps: true })
export class TechnicalService extends Document {
  @Prop({ type: Object, required: true })
  device: {
    model: string;
    color: string;
    capacity: string;
    IMEI: string;
    pin: string;
  };

  @Prop({ type: Object, required: true })
  customer: {
    fullName: string;
    IDNumber: string;
    phone: string;
    email?: string;
    instagram?: string;
  };

  @Prop({ type: Object, required: true })
  service: {
    entryReason: string;
    details?: string;
    price?: string;
    depositAmount?: string;
    isDeposited?: boolean;
    paymentMethod?: string;
    paymentStatus?: string[];
    remainingAmount?: string;
    entryDate: Date;
    exitDate?: Date;
    trackingCode: string;
    trackingStatus: string;
    observations?: string;
    deviceWarranty?: string;
  };

  @Prop({ type: [String] })
  images?: string[];

  @Prop({ type: Diagnosis })
  firstDiagnosis?: Diagnosis;

  @Prop({ type: Diagnosis })
  secondDiagnosis?: Diagnosis;

  @Prop({ type: [UsedProduct] })
  usedProducts?: UsedProduct[];

  @Prop({ default: false })
  isDeleted: boolean;
}

export const DiagnosisSchema = SchemaFactory.createForClass(Diagnosis);
export const UsedProductSchema = SchemaFactory.createForClass(UsedProduct);
export const TechnicalServiceSchema = SchemaFactory.createForClass(TechnicalService);


// Agregamos un pre-save hook para generar el trackingCode si no existe
TechnicalServiceSchema.pre('save', function (next) {
  if (!this.service.trackingCode) {
    this.service.trackingCode = generateTrackingCode();
  }
  next();
});