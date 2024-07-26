// src/sales/sales.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { Sale, SaleSchema } from '../schemas/sale.schema';
import { ProductsModule } from '../products/products.module';
import { CommonModule } from 'src/common/common.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Sale.name, schema: SaleSchema }]),
        CommonModule,
        ProductsModule,
    ],
    providers: [SalesService],
    controllers: [SalesController],
    exports: [SalesService],
})
export class SalesModule { }