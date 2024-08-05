
// src/sales/sales.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
        @InjectModel(Provider.name) private providerModel: Model<ProviderDocument>,
        private productsService: ProductsService,
        private readonly paginationService: PaginationService,

    ) { }

    async create(createPurchaseDto: any): Promise<Provider> {
        const createdPurchase = new this.providerModel(createPurchaseDto);

        // Update product stock
        for (const item of createPurchaseDto.products) {
            const product = await this.productsService.findOne(item.product.toString());
            if (!product) {
                throw new BadRequestException(`Product with ID "${item.product}" not found`);
            }
            await this.productsService.updateStock(item.product.toString(), item.quantity);
        }

        // Here you would add logic to reduce cash or update financial records
        // For example: await this.financialService.reduceCash(createPurchaseDto.totalPriceARS);

        return createdPurchase.save();
    }

    async findAll(): Promise<Provider[]> {
        return this.providerModel.find().populate('products').exec();
    }

    async findPaginated(paginationDto: PaginationDto) {
        return this.paginationService.paginate(this.providerModel, paginationDto);
    }

    async findOne(id: string): Promise<Provider> {
        return this.providerModel.findById(id).populate('products').exec();
    }

    async update(id: string, updateProviderDto: any): Promise<Provider> {
        return this.providerModel.findByIdAndUpdate(id, updateProviderDto, { new: true }).exec();
    }

    async softDelete(id: string): Promise<Provider> {
        const sale = await this.providerModel.findById(id);
        if (!sale) {
            throw new NotFoundException(`Provider with ID "${id}" not found`);
        }
        sale.isDeleted = true;
        return sale.save();
    }

    async permanentDelete(id: string): Promise<Provider> {
        const sale = await this.providerModel.findByIdAndDelete(id).exec();
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
