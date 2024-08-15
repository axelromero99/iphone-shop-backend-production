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

            const createdServiceId: any = createdService._id


            // Registrar la transacción en el turno actual si hay un pago
            if (createTechnicalServiceDto.service.price) {
                await this.cashRegisterService.addTransaction({
                    type: 'technicalService',
                    amount: parseFloat(createTechnicalServiceDto.service.price),
                    paymentMethod: createTechnicalServiceDto.service.paymentMethod,
                    description: `Technical Service: ${createdService._id}`,
                    relatedDocument: createdServiceId,
                    relatedDocumentType: 'TechnicalService'
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

    async getPeriodicReport(startDate: Date, endDate: Date): Promise<any> {
        const services = await this.technicalServiceModel.find({
            'service.entryDate': { $gte: startDate, $lte: endDate }
        }).populate('usedProducts.product').exec();

        const totalRevenue = services.reduce((sum, service) => sum + (parseFloat(service.service.price) || 0), 0);
        const totalServices = services.length;

        const productUsage = services.reduce((acc, service) => {
            service.usedProducts.forEach((item: any) => {
                if (!acc[item.product._id]) {
                    acc[item.product._id] = {
                        name: item.product.name,
                        quantity: 0
                    };
                }
                acc[item.product._id].quantity += item.quantity;
            });
            return acc;
        }, {});

        return {
            totalRevenue,
            totalServices,
            productUsage: Object.values(productUsage),
            services
        };
    }

    async getRecentServices(limit: number): Promise<TechnicalService[]> {
        return this.technicalServiceModel.find()
            .sort({ 'service.entryDate': -1 })
            .limit(limit)
            .populate('usedProducts.product')
            .exec();
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