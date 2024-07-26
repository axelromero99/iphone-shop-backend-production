// src/technical-service/technical-service.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TechnicalServiceService } from './technical-service.service';
import { TechnicalServiceController } from './technical-service.controller';
import { TechnicalService, TechnicalServiceSchema } from '../schemas/technical-service.schema';
import { Diagnosis, DiagnosisSchema } from '../schemas/technical-service.schema';
import { InventoryModule } from '../inventory/inventory.module';
import { CommonModule } from 'src/common/common.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: TechnicalService.name, schema: TechnicalServiceSchema }, { name: Diagnosis.name, schema: DiagnosisSchema },
        ]),
        InventoryModule,
        CommonModule,

    ],
    providers: [TechnicalServiceService],
    controllers: [TechnicalServiceController],
    exports: [TechnicalServiceService],
})
export class TechnicalServiceModule { }
