// src/products/products.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsService } from './products.service';
import { ProductTechnicalServiceService } from './product-technical-service.service';
import { ProductsController } from './products.controller';
import { Product, ProductSchema } from '../schemas/product.schema';
import { ProductTechnicalService, ProductTechnicalServiceSchema } from '../schemas/product-technical-service.schema';
import { CommonModule } from 'src/common/common.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Product.name, schema: ProductSchema },
            { name: ProductTechnicalService.name, schema: ProductTechnicalServiceSchema }
        ]),
        CommonModule,
    ],
    providers: [ProductsService, ProductTechnicalServiceService],
    controllers: [ProductsController],
    exports: [ProductsService, ProductTechnicalServiceService],
})
export class ProductsModule { }