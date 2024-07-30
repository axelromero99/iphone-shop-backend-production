
// src/sales/sales.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Provider, ProviderDocument } from '../schemas/provider.schema';
// import { CreateProviderDto } from './dto/create-sale.dto';
// import { UpdateProviderDto } from './dto/update-sale.dto';
import { ProductsService } from '../products/products.service';
import { PaginationService } from 'src/common/services/pagination.service';
import { PaginationDto, SortOrder } from 'src/common/dtos/pagination.dto';


@Injectable()
export class ProvidersService {
    constructor(
        @InjectModel(Provider.name) private saleModel: Model<ProviderDocument>,
        private productsService: ProductsService,
        private readonly paginationService: PaginationService,

    ) { }

    async create(createProviderDto: any): Promise<Provider> {
        const createdProvider = new this.saleModel(createProviderDto);

        // Update product stock
        for (const product of createProviderDto.products) {
            await this.productsService.updateStock(product.toString(), -1);
        }

        return createdProvider.save();
    }

    async findAll(): Promise<Provider[]> {
        return this.saleModel.find().populate('products').exec();
    }

    async findPaginated(paginationDto: PaginationDto) {
        return this.paginationService.paginate(this.saleModel, paginationDto);
    }

    async findOne(id: string): Promise<Provider> {
        return this.saleModel.findById(id).populate('products').exec();
    }

    async update(id: string, updateProviderDto: any): Promise<Provider> {
        return this.saleModel.findByIdAndUpdate(id, updateProviderDto, { new: true }).exec();
    }

    async softDelete(id: string): Promise<Provider> {
        const sale = await this.saleModel.findById(id);
        if (!sale) {
            throw new NotFoundException(`Provider with ID "${id}" not found`);
        }
        sale.isDeleted = true;
        return sale.save();
    }

    async permanentDelete(id: string): Promise<Provider> {
        const sale = await this.saleModel.findByIdAndDelete(id).exec();
        if (!sale) {
            throw new NotFoundException(`Provider with ID "${id}" not found`);
        }
        return sale;
    }

    async generateTrackingCode(): Promise<string> {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 8; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }
}
