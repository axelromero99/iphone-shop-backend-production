
// src/sales/sales.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Sale, SaleDocument } from '../schemas/sale.schema';
// import { CreateSaleDto } from './dto/create-sale.dto';
// import { UpdateSaleDto } from './dto/update-sale.dto';
import { ProductsService } from '../products/products.service';
import { PaginationService } from 'src/common/services/pagination.service';
import { PaginationDto, SortOrder } from 'src/common/dtos/pagination.dto';
import { generateTrackingCode } from '../utils/tracking-code.generator';
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
    //     const session = await this.saleModel.db.startSession();
    //     session.startTransaction();

    //     try {
    //         // Verificar stock y reducirlo
    //         for (const item of createSaleDto.products) {
    //             const product = await this.productsService.findOne(item.product.toString());
    //             if (!product) {
    //                 throw new NotFoundException(`Product with ID "${item.product}" not found`);
    //             }
    //             if (product.stock < item.quantity) {
    //                 throw new BadRequestException(`Insufficient stock for product "${product.name}"`);
    //             }
    //             await this.productsService.updateStock(item.product.toString(), -item.quantity, session);
    //         }

    //         // Crear la venta
    //         const createdSale = new this.saleModel(createSaleDto);
    //         await createdSale.save({ session });

    //         // Actualizar la caja
    //         await this.cashRegisterService.addIncome(createSaleDto.payment.totalPriceARS, 'Sale', session);

    //         await session.commitTransaction();
    //         return createdSale;
    //     } catch (error) {
    //         await session.abortTransaction();
    //         throw error;
    //     } finally {
    //         session.endSession();
    //     }
    // }

    async create(createSaleDto: CreateSaleDto): Promise<Sale> {
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

            // Registrar la transacción en el turno actual
            const currentShift = await this.cashRegisterService.getCurrentShift();
            await this.cashRegisterService.addTransaction(currentShift._id, {
                type: 'sale',
                amount: createSaleDto.payment.totalPriceARS,
                paymentMethod: createSaleDto.payment.method,
                relatedDocumentId: createdSale._id
            });

            await session.commitTransaction();
            return createdSale;
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
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
