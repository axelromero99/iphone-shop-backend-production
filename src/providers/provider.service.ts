
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


    async create(createProviderDto: any): Promise<Provider> {
        const session = await this.providerModel.db.startSession();
        session.startTransaction();

        try {
            const newProvider = new this.providerModel(createProviderDto);
            await newProvider.save({ session });

            // Actualizar stock de productos técnicos
            for (const item of createProviderDto.products) {
                await this.productTechnicalServiceService.updateStock(item.product.toString(), item.quantity, session);
            }

            // Registrar el gasto en la caja
            await this.cashRegisterService.registerExpense(createProviderDto.totalPrice, 'Provider Purchase', session);

            await session.commitTransaction();
            return newProvider;
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
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
        const session = await this.providerModel.db.startSession();
        session.startTransaction();

        try {
            const oldProvider = await this.providerModel.findById(id).session(session);
            if (!oldProvider) {
                throw new NotFoundException(`Provider with ID "${id}" not found`);
            }

            // Revertir cambios en el stock y en la caja
            for (const item of oldProvider.products) {
                await this.productTechnicalServiceService.updateStock(item.product.toString(), -item.quantity, session);
            }
            await this.cashRegisterService.registerIncome(oldProvider.totalPrice, 'Provider Purchase Reversal', session);

            // Aplicar nuevos cambios
            const updatedProvider = await this.providerModel.findByIdAndUpdate(id, updateProviderDto, { new: true, session }).exec();

            for (const item of updateProviderDto.products) {
                await this.productTechnicalServiceService.updateStock(item.product.toString(), item.quantity, session);
            }
            await this.cashRegisterService.registerExpense(updateProviderDto.totalPrice, 'Updated Provider Purchase', session);

            await session.commitTransaction();
            return updatedProvider;
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    async softDelete(id: string): Promise<Provider> {
        const sale = await this.providerModel.findById(id);
        if (!sale) {
            throw new NotFoundException(`Provider with ID "${id}" not found`);
        }
        sale.isDeleted = true;
        return sale.save();
    }


    async getProviderPurchaseHistory(id: string, startDate: Date, endDate: Date): Promise<any[]> {
        return this.providerModel.find({
            _id: id,
            purchaseDate: { $gte: startDate, $lte: endDate },
            isDeleted: false
        }).sort({ purchaseDate: -1 }).exec();
    }

    async getTotalPurchasesByProvider(startDate: Date, endDate: Date): Promise<any[]> {
        return this.providerModel.aggregate([
            {
                $match: {
                    purchaseDate: { $gte: startDate, $lte: endDate },
                    isDeleted: false
                }
            },
            {
                $group: {
                    _id: '$name',
                    totalPurchases: { $sum: '$totalPrice' },
                    purchaseCount: { $sum: 1 }
                }
            },
            {
                $sort: { totalPurchases: -1 }
            }
        ]).exec();
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
