// src/products/products.controller.ts
import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductTechnicalServiceService } from './product-technical-service.service';
import { AuditLog } from '../audit/audit-log.decorator';

@Controller('products')
export class ProductsController {
    constructor(
        private readonly productsService: ProductsService,
        private readonly productTechnicalServiceService: ProductTechnicalServiceService
    ) { }

    // Regular Product CRUD operations
    @AuditLog()
    @Post()
    createProduct(@Body() createProductDto: any) {
        return this.productsService.create(createProductDto);
    }

    @Get()
    findAllProducts() {
        return this.productsService.findAll();
    }

    @Get(':id')
    findOneProduct(@Param('id') id: string) {
        return this.productsService.findOne(id);
    }

    @AuditLog()
    @Put(':id')
    updateProduct(@Param('id') id: string, @Body() updateProductDto: any) {
        return this.productsService.update(id, updateProductDto);
    }

    @AuditLog()
    @Delete(':id')
    deleteProduct(@Param('id') id: string, @Query('permanent') permanent: boolean) {
        if (permanent) {
            return this.productsService.permanentDelete(id);
        } else {
            return this.productsService.softDelete(id);
        }
    }

    // Technical Service Product CRUD operations
    @AuditLog()
    @Post('technical-service')
    createTechnicalServiceProduct(@Body() createProductTechnicalServiceDto: any) {
        return this.productTechnicalServiceService.create(createProductTechnicalServiceDto);
    }

    @Get('technical-service')
    findAllTechnicalServiceProducts() {
        return this.productTechnicalServiceService.findAll();
    }

    @Get('technical-service/:id')
    findOneTechnicalServiceProduct(@Param('id') id: string) {
        return this.productTechnicalServiceService.findOne(id);
    }

    @AuditLog()
    @Put('technical-service/:id')
    updateTechnicalServiceProduct(@Param('id') id: string, @Body() updateProductTechnicalServiceDto: any) {
        return this.productTechnicalServiceService.update(id, updateProductTechnicalServiceDto);
    }

    @AuditLog()
    @Delete('technical-service/:id')
    deleteTechnicalServiceProduct(@Param('id') id: string, @Query('permanent') permanent: boolean) {
        if (permanent) {
            return this.productTechnicalServiceService.permanentDelete(id);
        } else {
            return this.productTechnicalServiceService.softDelete(id);
        }
    }
}