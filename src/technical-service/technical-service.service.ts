
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TechnicalService, TechnicalServiceDocument } from '../schemas/technical-service.schema';
// import { CreateTechnicalServiceDto } from './dto/create-technical-service.dto';
// import { UpdateTechnicalServiceDto } from './dto/update-technical-service.dto';
import { InventoryService } from '../inventory/inventory.service';
import { PaginationDto, SortOrder } from 'src/common/dtos/pagination.dto';

import { PaginationService } from 'src/common/services/pagination.service';



@Injectable()
export class TechnicalServiceService {
    constructor(
        @InjectModel(TechnicalService.name) private technicalServiceModel: Model<TechnicalServiceDocument>,
        private inventoryService: InventoryService,
        private readonly paginationService: PaginationService,

    ) { }
    async findPaginated(paginationDto: PaginationDto) {
        return this.paginationService.paginate(this.technicalServiceModel, paginationDto);
    }
    async create(createTechnicalServiceDto: any): Promise<TechnicalService> {
        const createdService = new this.technicalServiceModel(createTechnicalServiceDto);

        // Update inventory for used items
        // TODO: Uncomment this code when inventory service is implemented
        // for (const item of createTechnicalServiceDto.usedItems) {
        //     await this.inventoryService.updateStock(item.toString(), -1);
        // }

        return createdService.save();
    }

    async findAll(): Promise<TechnicalService[]> {
        return this.technicalServiceModel.find().populate('usedItems').exec();
    }

    async findOne(id: string): Promise<TechnicalService> {
        return this.technicalServiceModel.findById(id).populate('usedItems').exec();
    }

    async update(id: string, updateTechnicalServiceDto: any): Promise<TechnicalService> {
        return this.technicalServiceModel.findByIdAndUpdate(id, updateTechnicalServiceDto, { new: true }).exec();
    }

    // async remove(id: string): Promise<TechnicalService> {
    //     return this.technicalServiceModel.findByIdAndRemove(id).exec();
    // }

    async softDelete(id: string): Promise<TechnicalService> {
        const sale = await this.technicalServiceModel.findById(id);
        if (!sale) {
            throw new NotFoundException(`Sale with ID "${id}" not found`);
        }
        sale.isDeleted = true;
        return sale.save();
    }

    async permanentDelete(id: string): Promise<TechnicalService> {
        const sale = await this.technicalServiceModel.findByIdAndDelete(id).exec();
        if (!sale) {
            throw new NotFoundException(`Sale with ID "${id}" not found`);
        }
        return sale;
    }
}

