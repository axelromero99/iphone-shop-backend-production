

// src/provider/provider.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProvidersService } from './provider.service';
import { ProvidersController } from './provider.controller';
import { ProviderSchema } from '../schemas/provider.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Provider', schema: ProviderSchema },
        ]),
    ],
    providers: [ProvidersService],
    controllers: [ProvidersController],
})
export class ProviderModule { }