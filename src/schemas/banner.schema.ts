import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BannerDocument = Banner & Document;

@Schema({ timestamps: true })
export class Banner {
  @Prop({ required: false })
  title: string;

  @Prop({ required: false })
  description: string;

  // @Prop({ required: true })
  @Prop({ required: false })
  imageUrl: string;

  @Prop({ required: false })
  cloudinaryPublicId: string;

  @Prop({ default: false })
  isActive: boolean;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const BannerSchema = SchemaFactory.createForClass(Banner);