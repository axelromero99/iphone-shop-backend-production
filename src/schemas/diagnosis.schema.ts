import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';

// export interface IDiagnosis extends Document {
//   screws?: boolean;
//   powerButton?: boolean;
//   charging?: boolean;
//   homeButton?: boolean;
//   touchFaceID?: boolean;
//   trueTone?: boolean;
//   flash?: boolean;
//   cameraT1?: boolean;
//   cameraT2?: boolean;
//   cameraT3?: boolean;
//   frontCamera?: boolean;
//   gyroscope?: boolean;
//   signal?: boolean;
//   imei?: boolean;
//   proximitySensor?: boolean;
//   bottomSpeaker?: boolean;
//   topSpeaker?: boolean;
//   vibrator?: boolean;
//   volume?: boolean;
//   batteryCondition?: number;
//   wifi?: boolean;
//   microphone?: boolean;
//   muteSound?: boolean;
//   touch?: boolean;
// }

@Schema()
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
}

export const DiagnosisSchema = SchemaFactory.createForClass(Diagnosis);
// export const Diagnostico: Model<IDiagnosis> = mongoose.models.Diagnostico || mongoose.model<IDiagnosis>("Diagnostico", DiagnosisSchema);
