// src/products/product-technical-service.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductTechnicalService, ProductTechnicalServiceDocument } from '../schemas/product-technical-service.schema';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { PaginationService } from 'src/common/services/pagination.service';

@Injectable()
export class ProductTechnicalServiceService {
    constructor(
        @InjectModel(ProductTechnicalService.name) private productTechnicalServiceModel: Model<ProductTechnicalServiceDocument>,
        private readonly paginationService: PaginationService,
    ) { }

    async findPaginated(paginationDto: PaginationDto) {
        return this.paginationService.paginate(this.productTechnicalServiceModel, paginationDto);
    }

    async create(createProductTechnicalServiceDto: any): Promise<ProductTechnicalService> {
        const createdProductTechnicalService = new this.productTechnicalServiceModel(createProductTechnicalServiceDto);
        return createdProductTechnicalService.save();
    }

    async findAll(): Promise<ProductTechnicalService[]> {
        return this.productTechnicalServiceModel.find().exec();
    }

    async findOne(id: string): Promise<ProductTechnicalService> {
        return this.productTechnicalServiceModel.findById(id).exec();
    }

    async update(id: string, updateProductTechnicalServiceDto: any): Promise<ProductTechnicalService> {
        return this.productTechnicalServiceModel.findByIdAndUpdate(id, updateProductTechnicalServiceDto, { new: true }).exec();
    }

    async updateStock(id: string, quantity: number): Promise<ProductTechnicalService> {
        const product = await this.productTechnicalServiceModel.findById(id);
        if (!product) {
            throw new NotFoundException(`ProductTechnicalService with ID "${id}" not found`);
        }

        const newStock = product.stock + quantity;
        if (newStock < 0) {
            throw new BadRequestException(`Cannot reduce stock below 0. Current stock: ${product.stock}, Requested change: ${quantity}`);
        }

        product.stock = newStock;
        return product.save();
    }

    async softDelete(id: string): Promise<ProductTechnicalService> {
        const productTechnicalService = await this.productTechnicalServiceModel.findById(id);
        if (!productTechnicalService) {
            throw new NotFoundException(`ProductTechnicalService with ID "${id}" not found`);
        }
        productTechnicalService.isDeleted = true;
        return productTechnicalService.save();
    }

    async permanentDelete(id: string): Promise<ProductTechnicalService> {
        const productTechnicalService = await this.productTechnicalServiceModel.findByIdAndDelete(id).exec();
        if (!productTechnicalService) {
            throw new NotFoundException(`ProductTechnicalService with ID "${id}" not found`);
        }
        return productTechnicalService;
    }
}