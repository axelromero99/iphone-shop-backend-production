
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TechnicalService, TechnicalServiceDocument } from '../schemas/technical-service.schema';
// import { CreateTechnicalServiceDto } from './dto/create-technical-service.dto';
// import { UpdateTechnicalServiceDto } from './dto/update-technical-service.dto';
// import { InventoryService } from '../inventory/inventory.service';

@Injectable()
export class TechnicalServiceService {
    constructor(
        @InjectModel(TechnicalService.name) private technicalServiceModel: Model<TechnicalServiceDocument>,
        // private inventoryService: InventoryService,
    ) { }

    async create(createTechnicalServiceDto: any): Promise<TechnicalService> {
        const createdService = new this.technicalServiceModel(createTechnicalServiceDto);

        // Update inventory for used items
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

    async generateTrackingCode(): Promise<string> {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 8; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }
}
