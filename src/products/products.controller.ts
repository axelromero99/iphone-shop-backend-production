
// src/products/products.controller.ts
import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
// import { CreateProductDto } from './dto/create-product.dto';
// import { UpdateProductDto } from './dto/update-product.dto';
import { AuditLog } from 'src/audit/audit-log.decorator';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @AuditLog()
    @Post()
    create(@Body() createProductDto: any) {
        return this.productsService.create(createProductDto);
    }

    @Get()
    findAll() {
        return this.productsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.productsService.findOne(id);
    }

    @AuditLog()
    @Put(':id')
    update(@Param('id') id: string, @Body() updateProductDto: any) {
        return this.productsService.update(id, updateProductDto);
    }

    @AuditLog()
    @Delete(':id')
    delete(@Param('id') id: string, @Query('permanent') permanent: boolean) {
        if (permanent) {
            return this.productsService.permanentDelete(id);
        } else {
            return this.productsService.softDelete(id);
        }
    }
}
