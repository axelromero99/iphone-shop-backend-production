
// src/products/products.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from '../schemas/product.schema';
// import { CreateProductDto } from './dto/create-product.dto';
// import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto, SortOrder } from 'src/common/dtos/pagination.dto';

import { PaginationService } from 'src/common/services/pagination.service';




@Injectable()
export class ProductsService {
    constructor(@InjectModel(Product.name) private productModel: Model<ProductDocument>,
        private readonly paginationService: PaginationService,

    ) { }


    async findPaginated(paginationDto: PaginationDto) {
        return this.paginationService.paginate(this.productModel, paginationDto);
    }

    async create(createProductDto: any): Promise<Product> {
        const createdProduct = new this.productModel(createProductDto);
        return createdProduct.save();
    }

    async findAll(): Promise<Product[]> {
        return this.productModel.find().exec();
    }

    async findOne(id: string): Promise<Product> {
        return this.productModel.findById(id).exec();
    }

    async update(id: string, updateProductDto: any): Promise<Product> {
        return this.productModel.findByIdAndUpdate(id, updateProductDto, { new: true }).exec();
    }

    async softDelete(id: string): Promise<Product> {
        const sale = await this.productModel.findById(id);
        if (!sale) {
            throw new NotFoundException(`Product with ID "${id}" not found`);
        }
        sale.isDeleted = true;
        return sale.save();
    }

    async permanentDelete(id: string): Promise<Product> {
        const sale = await this.productModel.findByIdAndDelete(id).exec();
        if (!sale) {
            throw new NotFoundException(`Product with ID "${id}" not found`);
        }
        return sale;
    }

    async updateStock(id: string, quantity: number): Promise<Product> {
        return this.productModel.findByIdAndUpdate(
            id,
            { $inc: { stock: quantity } },
            { new: true }
        ).exec();
    }
}
