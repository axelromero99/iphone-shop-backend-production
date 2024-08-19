
// src/sales/sales.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Provider, ProviderDocument } from '../schemas/provider.schema';
// import { CreateProviderDto } from './dto/create-sale.dto';
// import { UpdateProviderDto } from './dto/update-sale.dto';
import { ProductsService } from '../products/products.service';
import { PaginationService } from '../common/services/pagination.service';
import { PaginationDto, SortOrder } from '../common/dtos/pagination.dto';
import { ProductTechnicalServiceService } from '../products/product-technical-service.service';
import { CashRegisterService } from '../cash-register/cash-register.service';


@Injectable()
export class ProvidersService {
    constructor(
        @InjectModel(Provider.name) private providerModel: Model<ProviderDocument>,
        private readonly paginationService: PaginationService,
        private readonly productTechnicalServiceService: ProductTechnicalServiceService,
        private readonly cashRegisterService: CashRegisterService,

    ) { }


    async create(createProviderDto: any): Promise<Provider> {
        const maxRetries = 3;
        let retries = 0;

        while (retries < maxRetries) {
            const session = await this.providerModel.db.startSession();
            session.startTransaction();

            try {
                console.log(`Starting provider creation transaction (Attempt ${retries + 1})`);

                const newProvider = new this.providerModel(createProviderDto);
                console.log('Saving new provider');
                await newProvider.save({ session });
                console.log('New provider saved successfully');

                console.log('Updating product stock');
                for (const item of createProviderDto.products) {
                    console.log(`Updating stock for product: ${item.product}`);
                    await this.productTechnicalServiceService.updateStock(item.product.toString(), item.quantity, session);
                }
                console.log('Product stock updated successfully');

                if (isNaN(createProviderDto.totalPrice) || createProviderDto.totalPrice <= 0) {
                    throw new BadRequestException('Invalid total price for provider purchase');
                }

                console.log('Adding expense to cash register');
                await this.cashRegisterService.addExpense(
                    createProviderDto.totalPrice,
                    `Provider Purchase: ${createProviderDto.name}`,
                    session
                );
                console.log('Expense added successfully');

                console.log('Committing transaction');
                await session.commitTransaction();
                console.log('Transaction committed successfully');

                return newProvider;
            } catch (error) {
                console.error(`Error in provider creation (Attempt ${retries + 1}):`, error);
                await session.abortTransaction();
                console.log('Transaction aborted');

                if (error.code === 112 && error.codeName === 'WriteConflict' && retries < maxRetries - 1) {
                    retries++;
                    console.log(`Retrying operation (Attempt ${retries + 1})`);
                    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second before retrying
                } else {
                    if (error instanceof BadRequestException) {
                        throw error;
                    }
                    throw new BadRequestException('Failed to create provider: ' + error.message);
                }
            } finally {
                console.log('Ending session');
                session.endSession();
            }
        }

        throw new BadRequestException('Failed to create provider after multiple attempts');
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
            await this.cashRegisterService.addIncome(oldProvider.totalPrice, 'Provider Purchase Reversal', session);

            // Aplicar nuevos cambios
            const updatedProvider = await this.providerModel.findByIdAndUpdate(id, updateProviderDto, { new: true, session }).exec();

            for (const item of updateProviderDto.products) {
                await this.productTechnicalServiceService.updateStock(item.product.toString(), item.quantity, session);
            }
            await this.cashRegisterService.addExpense(updateProviderDto.totalPrice, 'Updated Provider Purchase', session);

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
