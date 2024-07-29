
// src/banner/banner.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BannersService } from './banner.service';
import { BannerController } from './banner.controller';
import { BannerSchema } from '../schemas/banner.schema';
import { CommonModule } from 'src/common/common.module';


@Module({
    imports: [MongooseModule.forFeature([{ name: 'Banner', schema: BannerSchema }]),
        CommonModule,
    ],
    providers: [BannersService],
    controllers: [BannerController],
})
export class BannersModule { }