import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';



@Schema({ timestamps: true })
export class Diagnosis {
  @Prop()
  screws?: boolean;

  @Prop()
  powerButton?: boolean;

  @Prop()
  charging?: boolean;

  @Prop()
  homeButton?: boolean;

  @Prop()
  touchFaceID?: boolean;

  @Prop()
  trueTone?: boolean;

  @Prop()
  flash?: boolean;

  @Prop()
  cameraT1?: boolean;

  @Prop()
  cameraT2?: boolean;

  @Prop()
  cameraT3?: boolean;

  @Prop()
  frontCamera?: boolean;

  @Prop()
  gyroscope?: boolean;

  @Prop()
  signal?: boolean;

  @Prop()
  imei?: boolean;

  @Prop()
  proximitySensor?: boolean;

  @Prop()
  bottomSpeaker?: boolean;

  @Prop()
  topSpeaker?: boolean;

  @Prop()
  vibrator?: boolean;

  @Prop()
  volume?: boolean;

  @Prop()
  batteryCondition?: number;

  @Prop()
  wifi?: boolean;

  @Prop()
  microphone?: boolean;

  @Prop()
  muteSound?: boolean;

  @Prop()
  touch?: boolean;

  @Prop({ type: Date, required: true })
  diagnosisDate: Date;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const DiagnosisSchema = SchemaFactory.createForClass(Diagnosis);
// export const Diagnostico: Model<IDiagnosis> = mongoose.models.Diagnostico || mongoose.model<IDiagnosis>("Diagnostico", DiagnosisSchema);
