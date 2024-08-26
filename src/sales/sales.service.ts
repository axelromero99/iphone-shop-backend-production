
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Sale, SaleDocument } from '../schemas/sale.schema';
// import { CreateSaleDto } from './dto/create-sale.dto';
// import { UpdateSaleDto } from './dto/update-sale.dto';
import { ProductsService } from '../products/products.service';
import { PaginationService } from '../common/services/pagination.service';
import { PaginationDto, SortOrder } from '../common/dtos/pagination.dto';
import { CashRegisterService } from '../cash-register/cash-register.service';

@Injectable()
export class SalesService {
    constructor(
        @InjectModel(Sale.name) private saleModel: Model<SaleDocument>,
        private productsService: ProductsService,
        private readonly paginationService: PaginationService,
        private cashRegisterService: CashRegisterService,
    ) { }

    // async create(createSaleDto: any): Promise<Sale> {
    async create(createSaleDto: any) {
        const session = await this.saleModel.db.startSession();
        session.startTransaction();

        try {
            // Verificar stock y reducirlo
            for (const item of createSaleDto.products) {
                const product = await this.productsService.findOne(item.product.toString());
                if (!product) {
                    throw new NotFoundException(`Product with ID "${item.product}" not found`);
                }
                if (product.stock < item.quantity) {
                    throw new BadRequestException(`Insufficient stock for product "${product.name}"`);
                }
                await this.productsService.updateStock(item.product.toString(), -item.quantity, session);
            }

            // Crear la venta
            const createdSale = new this.saleModel(createSaleDto);
            await createdSale.save({ session });

            const createdSaleId: any = createdSale._id

            // Obtener el método de pago de la venta
            const paymentMethod = createSaleDto.payment.paymentDetails[0].method;

            // Crear la transacción
            const transaction = await this.cashRegisterService.addTransaction({
                type: 'sale',
                amount: createSaleDto.payment.totalPriceARS,
                paymentMethod: paymentMethod,
                description: `Sale: ${createdSale._id}`,
                relatedDocument: createdSaleId,
                relatedDocumentType: 'Sale'
            });

            await session.commitTransaction();
            return { sale: createdSale, transaction };
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }


    async getPeriodicReport(startDate: Date, endDate: Date): Promise<any> {
        const sales = await this.saleModel.find({
            createdAt: { $gte: startDate, $lte: endDate }
        }).populate('products.product').exec();

        const totalSales = sales.reduce((sum, sale) => sum + sale.payment.totalPriceARS, 0);
        const totalItems = sales.reduce((sum, sale) => sum + sale.products.reduce((itemSum, product) => itemSum + product.quantity, 0), 0);

        const productSales = sales.reduce((acc, sale) => {
            sale.products.forEach((item: any) => {
                if (!acc[item.product._id]) {
                    acc[item.product._id] = {
                        name: item.product.name,
                        quantity: 0,
                        totalSales: 0
                    };
                }
                acc[item.product._id].quantity += item.quantity;
                acc[item.product._id].totalSales += item.quantity * item.product.priceARS;
            });
            return acc;
        }, {});

        return {
            totalSales,
            totalItems,
            salesCount: sales.length,
            productSales: Object.values(productSales),
            sales
        };
    }

    async getRecentSales(limit: number): Promise<Sale[]> {
        return this.saleModel.find()
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate('products.product')
            .exec();
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
        const session = await this.saleModel.db.startSession();
        session.startTransaction();

        try {
            const oldSale = await this.saleModel.findById(id).session(session);
            if (!oldSale) {
                throw new NotFoundException(`Sale with ID "${id}" not found`);
            }

            // Revertir cambios anteriores
            for (const item of oldSale.products) {
                await this.productsService.updateStock(item.product.toString(), item.quantity, session);
            }
            await this.cashRegisterService.addExpense(oldSale.payment.totalPriceARS, 'Sale Reversal', session);

            // Aplicar nuevos cambios
            for (const item of updateSaleDto.products) {
                await this.productsService.updateStock(item.product.toString(), -item.quantity, session);
            }
            await this.cashRegisterService.addIncome(updateSaleDto.payment.totalPriceARS, 'Updated Sale', session);

            const updatedSale = await this.saleModel.findByIdAndUpdate(id, updateSaleDto, { new: true, session }).exec();

            await session.commitTransaction();
            return updatedSale;
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
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
