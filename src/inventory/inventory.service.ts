
// src/inventory/inventory.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InventoryItem, InventoryItemDocument } from '../schemas/inventory-item.schema';
// import { CreateInventoryItemDto } from './dto/create-inventory-item.dto';
// import { UpdateInventoryItemDto } from './dto/update-inventory-item.dto';
import { PaginationDto, SortOrder } from 'src/common/dtos/pagination.dto';

import { PaginationService } from 'src/common/services/pagination.service';



@Injectable()
export class InventoryService {
    constructor(
        @InjectModel(InventoryItem.name) private inventoryItemModel: Model<InventoryItemDocument>,
        private readonly paginationService: PaginationService,

    ) { }

    async findPaginated(paginationDto: PaginationDto) {
        return this.paginationService.paginate(this.inventoryItemModel, paginationDto);
    }

    async create(createInventoryItemDto: any): Promise<InventoryItem> {
        const createdItem = new this.inventoryItemModel(createInventoryItemDto);
        return createdItem.save();
    }

    async findAll(): Promise<InventoryItem[]> {
        return this.inventoryItemModel.find().exec();
    }

    async findOne(id: string): Promise<InventoryItem> {
        return this.inventoryItemModel.findById(id).exec();
    }

    async update(id: string, updateInventoryItemDto: any): Promise<InventoryItem> {
        return this.inventoryItemModel.findByIdAndUpdate(id, updateInventoryItemDto, { new: true }).exec();
    }

    async softDelete(id: string): Promise<InventoryItem> {
        const inventory = await this.inventoryItemModel.findById(id);
        if (!inventory) {
            throw new NotFoundException(`InventoryItem with ID "${id}" not found`);
        }
        inventory.isDeleted = true;
        return inventory.save();
    }

    async permanentDelete(id: string): Promise<InventoryItem> {
        const inventory = await this.inventoryItemModel.findByIdAndDelete(id).exec();
        if (!inventory) {
            throw new NotFoundException(`Product with ID "${id}" not found`);
        }
        return inventory;
    }

    async updateStock(id: string, quantity: number): Promise<InventoryItem> {
        return this.inventoryItemModel.findByIdAndUpdate(
            id,
            { $inc: { quantity: quantity } },
            { new: true }
        ).exec();
    }



    async findLowStock(): Promise<InventoryItem[]> {
        return this.inventoryItemModel.find({
            quantity: { $lte: '$minimumStockLevel' },
            isDeleted: false
        }).exec();
    }

    // async updateStock(id: string, quantity: number): Promise<InventoryItem> {
    //     const item = await this.inventoryItemModel.findById(id);
    //     if (!item) {
    //         throw new NotFoundException(`Inventory item with ID "${id}" not found`);
    //     }
    //     item.quantity += quantity;
    //     item.lastRestockDate = new Date();
    //     return item.save();
    // }

    // async getStockMovements(id: string, startDate: Date, endDate: Date): Promise<any[]> {
    //     // Implementar lógica para obtener movimientos de stock
    //     // Esto requerirá un nuevo schema para StockMovement
    // }

}