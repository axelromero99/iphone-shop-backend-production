

// src/provider/provider.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProviderService } from './provider.service';
import { ProviderController } from './provider.controller';
import { ProviderSchema } from '../schemas/provider.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Provider', schema: ProviderSchema },
        ]),
    ],
    providers: [ProviderService],
    controllers: [ProviderController],
})
export class ProviderModule { }