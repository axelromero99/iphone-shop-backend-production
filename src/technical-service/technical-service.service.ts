import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TechnicalService, TechnicalServiceDocument } from '../schemas/technical-service.schema';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { PaginationService } from 'src/common/services/pagination.service';
import { ProductTechnicalServiceService } from '../products/product-technical-service.service';

@Injectable()
export class TechnicalServiceService {
    constructor(
        @InjectModel(TechnicalService.name) private technicalServiceModel: Model<TechnicalServiceDocument>,
        private productTechnicalServiceService: ProductTechnicalServiceService,
        private readonly paginationService: PaginationService,
    ) { }

    async findPaginated(paginationDto: PaginationDto) {
        return this.paginationService.paginate(this.technicalServiceModel, paginationDto);
    }

    async create(createTechnicalServiceDto: any): Promise<TechnicalService> {
        let totalCost = 0;

        console.log("createTechnicalServiceDto", createTechnicalServiceDto)
        for (const item of createTechnicalServiceDto.usedProducts) {
            const product = await this.productTechnicalServiceService.findOne(item.product.toString());
            if (!product) {
                throw new BadRequestException(`ProductTechnicalService with ID "${item.product}" not found`);
            }
            if (product.stock < item.quantity) {
                throw new BadRequestException(`Insufficient stock for product "${product.name}". Available: ${product.stock}, Requested: ${item.quantity}`);
            }
            totalCost += product.priceUSD * item.quantity;
        }

        const createdService = new this.technicalServiceModel({
            ...createTechnicalServiceDto,
            totalCost
        });

        // Actualizar stock de productos usados
        for (const item of createTechnicalServiceDto.usedProducts) {
            try {
                await this.productTechnicalServiceService.updateStock(item.product.toString(), -item.quantity);
            } catch (error) {
                // Si hay un error al actualizar el stock, revertimos las actualizaciones anteriores
                for (const revertItem of createTechnicalServiceDto.usedProducts) {
                    if (revertItem.product === item.product) break;
                    await this.productTechnicalServiceService.updateStock(revertItem.product.toString(), revertItem.quantity);
                }
                throw new BadRequestException(`Error updating stock: ${error.message}`);
            }
        }

        return createdService.save();
    }

    async findAll(): Promise<TechnicalService[]> {
        return this.technicalServiceModel.find().populate('usedProducts.product').exec();
    }

    async findOne(id: string): Promise<TechnicalService> {
        return this.technicalServiceModel.findById(id).populate('usedProducts.product').exec();
    }

    async update(id: string, updateTechnicalServiceDto: any): Promise<TechnicalService> {
        return this.technicalServiceModel.findByIdAndUpdate(id, updateTechnicalServiceDto, { new: true }).exec();
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