import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryService } from './services/cloudinary.service';
import cloudinaryConfig from '../config/cloudinary.config';

@Module({
    imports: [ConfigModule.forFeature(cloudinaryConfig)],
    providers: [CloudinaryService],
    exports: [CloudinaryService],
})
export class CloudinaryModule { }