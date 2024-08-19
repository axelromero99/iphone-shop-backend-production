// src/technical-service/technical-service.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TechnicalServiceService } from './technical-service.service';
import { TechnicalServiceController } from './technical-service.controller';
import { TechnicalService, TechnicalServiceSchema } from '../schemas/technical-service.schema';
import { Diagnosis, DiagnosisSchema } from '../schemas/technical-service.schema';
import { InventoryModule } from '../inventory/inventory.module';
import { CommonModule } from '../common/common.module';
import { ProductsModule } from '../products/products.module';
import { CashRegisterModule } from '../cash-register/cash-register.module'; // Añade esta línea

@Module({
    imports: [
        MongooseModule.forFeature([{ name: TechnicalService.name, schema: TechnicalServiceSchema }, { name: Diagnosis.name, schema: DiagnosisSchema },
        ]),
        InventoryModule,
        ProductsModule,
        CashRegisterModule, // Añade esta línea

        CommonModule,

    ],
    providers: [TechnicalServiceService],
    controllers: [TechnicalServiceController],
    exports: [TechnicalServiceService],
})
export class TechnicalServiceModule { }
