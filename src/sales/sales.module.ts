// src/sales/sales.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { Sale, SaleSchema } from '../schemas/sale.schema';
import { ProductsModule } from '../products/products.module';
import { CommonModule } from '../common/common.module';
import { CashRegisterModule } from '../cash-register/cash-register.module'; // Añade esta línea

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Sale.name, schema: SaleSchema }]),
        CommonModule,
        ProductsModule,
        CashRegisterModule, // Añade esta línea
    ],
    providers: [SalesService],
    controllers: [SalesController],
    exports: [SalesService],
})
export class SalesModule { }