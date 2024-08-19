// src/products/product-technical-service.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductTechnicalService, ProductTechnicalServiceDocument } from '../schemas/product-technical-service.schema';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { PaginationService } from '../common/services/pagination.service';

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


    async updateStock(productId: string, quantity: number, session?: any): Promise<any> {
        const options = session ? { session } : {};
        const product = await this.productTechnicalServiceModel.findById(productId).session(session);
        if (!product) {
            throw new NotFoundException(`Producto con ID "${productId}" no encontrado`);
        }

        const newStock = product.stock + quantity;
        if (newStock < 0) {
            throw new BadRequestException(`No hay suficiente stock para el producto "${product.name}"`);
        }

        product.stock = newStock;
        await product.save(options);

        return product;
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