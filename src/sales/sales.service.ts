
// src/sales/sales.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Sale, SaleDocument } from '../schemas/sale.schema';
// import { CreateSaleDto } from './dto/create-sale.dto';
// import { UpdateSaleDto } from './dto/update-sale.dto';
import { ProductsService } from '../products/products.service';
import { PaginationService } from 'src/common/services/pagination.service';
import { PaginationDto, SortOrder } from 'src/common/dtos/pagination.dto';
import { generateTrackingCode } from '../utils/tracking-code.generator';


@Injectable()
export class SalesService {
    constructor(
        @InjectModel(Sale.name) private saleModel: Model<SaleDocument>,
        private productsService: ProductsService,
        private readonly paginationService: PaginationService,

    ) { }

    async create(createSaleDto: any): Promise<Sale> {
        const createdSale = new this.saleModel(createSaleDto);

        // Update product stock
        // Update product stock
        for (const item of createSaleDto.products) {
            await this.productsService.updateStock(item.product.toString(), -item.quantity);
        }

        return createdSale.save();
    }

    async findAll(): Promise<Sale[]> {
        return this.saleModel.find().populate('products').exec();
    }

    async findPaginated(paginationDto: PaginationDto) {
        return this.paginationService.paginate(this.saleModel, paginationDto);
    }

    async findOne(id: string): Promise<Sale> {
        return this.saleModel.findById(id).populate('products').exec();
    }

    async update(id: string, updateSaleDto: any): Promise<Sale> {
        return this.saleModel.findByIdAndUpdate(id, updateSaleDto, { new: true }).exec();
    }

    async softDelete(id: string): Promise<Sale> {
        const sale = await this.saleModel.findById(id);
        if (!sale) {
            throw new NotFoundException(`Sale with ID "${id}" not found`);
        }
        sale.isDeleted = true;
        return sale.save();
    }

    async permanentDelete(id: string): Promise<Sale> {
        const sale = await this.saleModel.findByIdAndDelete(id).exec();
        if (!sale) {
            throw new NotFoundException(`Sale with ID "${id}" not found`);
        }
        return sale;
    }


}
