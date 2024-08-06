import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TechnicalService, TechnicalServiceDocument } from '../schemas/technical-service.schema';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { PaginationService } from 'src/common/services/pagination.service';
import { ProductTechnicalServiceService } from '../products/product-technical-service.service';
import { CashRegisterService } from '../cash-register/cash-register.service';

@Injectable()
export class TechnicalServiceService {
    constructor(
        @InjectModel(TechnicalService.name) private technicalServiceModel: Model<TechnicalServiceDocument>,
        private productTechnicalServiceService: ProductTechnicalServiceService,
        private cashRegisterService: CashRegisterService,

        private readonly paginationService: PaginationService,
    ) { }

    async findPaginated(paginationDto: PaginationDto) {
        return this.paginationService.paginate(this.technicalServiceModel, paginationDto);
    }



    async create(createTechnicalServiceDto: any): Promise<TechnicalService> {
        const session = await this.technicalServiceModel.db.startSession();
        session.startTransaction();

        try {
            // Verificar stock y reducirlo
            for (const item of createTechnicalServiceDto.usedProducts) {
                const product = await this.productTechnicalServiceService.findOne(item.product.toString());
                if (!product) {
                    throw new NotFoundException(`ProductTechnicalService with ID "${item.product}" not found`);
                }
                if (product.stock < item.quantity) {
                    throw new BadRequestException(`Insufficient stock for product "${product.name}"`);
                }
                await this.productTechnicalServiceService.updateStock(item.product.toString(), -item.quantity, session);
            }

            // Crear el servicio técnico
            const createdService = new this.technicalServiceModel(createTechnicalServiceDto);
            await createdService.save({ session });

            // Registrar la transacción en el turno actual si hay un pago
            if (createTechnicalServiceDto.service.price) {
                const currentShift = await this.cashRegisterService.getCurrentShift();
                await this.cashRegisterService.addTransaction(currentShift._id, {
                    type: 'technicalService',
                    amount: parseFloat(createTechnicalServiceDto.service.price),
                    paymentMethod: createTechnicalServiceDto.service.paymentMethod,
                    relatedDocumentId: createdService._id
                });
            }

            await session.commitTransaction();
            return createdService;
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    async findAll(): Promise<TechnicalService[]> {
        return this.technicalServiceModel.find().populate('usedProducts.product').exec();
    }

    async findOne(id: string): Promise<TechnicalService> {
        return this.technicalServiceModel.findById(id).populate('usedProducts.product').exec();
    }


    async update(id: string, updateTechnicalServiceDto: any): Promise<TechnicalService> {
        const session = await this.technicalServiceModel.db.startSession();
        session.startTransaction();

        try {
            const oldService = await this.technicalServiceModel.findById(id).session(session);
            if (!oldService) {
                throw new NotFoundException(`TechnicalService with ID "${id}" not found`);
            }

            // Revertir cambios anteriores
            for (const item of oldService.usedProducts) {
                await this.productTechnicalServiceService.updateStock(item.product.toString(), item.quantity, session);
            }
            if (oldService.service.price) {
                await this.cashRegisterService.addExpense(parseFloat(oldService.service.price), 'Technical Service Reversal', session);
            }

            // Aplicar nuevos cambios
            for (const item of updateTechnicalServiceDto.usedProducts) {
                await this.productTechnicalServiceService.updateStock(item.product.toString(), -item.quantity, session);
            }
            if (updateTechnicalServiceDto.service.price) {
                await this.cashRegisterService.addIncome(parseFloat(updateTechnicalServiceDto.service.price), 'Updated Technical Service', session);
            }

            const updatedService = await this.technicalServiceModel.findByIdAndUpdate(id, updateTechnicalServiceDto, { new: true, session }).exec();

            await session.commitTransaction();
            return updatedService;
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    async softDelete(id: string): Promise<TechnicalService> {
        const service = await this.technicalServiceModel.findById(id);
        if (!service) {
            throw new NotFoundException(`TechnicalService with ID "${id}" not found`);
        }
        service.isDeleted = true;
        return service.save();
    }

    async permanentDelete(id: string): Promise<TechnicalService> {
        const service = await this.technicalServiceModel.findByIdAndDelete(id).exec();
        if (!service) {
            throw new NotFoundException(`TechnicalService with ID "${id}" not found`);
        }
        return service;
    }
}