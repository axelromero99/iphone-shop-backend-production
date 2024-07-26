
// src/sales/sales.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Sale, SaleDocument } from '../schemas/sale.schema';
// import { CreateSaleDto } from './dto/create-sale.dto';
// import { UpdateSaleDto } from './dto/update-sale.dto';
import { ProductsService } from '../products/products.service';
import { PaginationService } from 'src/common/services/pagination.service';
import { PaginationDto, SortOrder } from 'src/common/dtos/pagination.dto';


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
        for (const product of createSaleDto.products) {
            await this.productsService.updateStock(product.toString(), -1);
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

    // async remove(id: string): Promise<Sale> {
    //     return this.saleModel.findByIdAndRemove(id).exec();
    // }

    async generateTrackingCode(): Promise<string> {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 8; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }
}
