
// src/inventory/inventory.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InventoryItem, InventoryItemDocument } from '../schemas/inventory-item.schema';
// import { CreateInventoryItemDto } from './dto/create-inventory-item.dto';
// import { UpdateInventoryItemDto } from './dto/update-inventory-item.dto';

@Injectable()
export class InventoryService {
    constructor(
        @InjectModel(InventoryItem.name) private inventoryItemModel: Model<InventoryItemDocument>,
    ) { }

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

    // async remove(id: string): Promise<InventoryItem> {
    //     return this.inventoryItemModel.findByIdAndRemove(id).exec();
    // }

    async updateStock(id: string, quantity: number): Promise<InventoryItem> {
        return this.inventoryItemModel.findByIdAndUpdate(
            id,
            { $inc: { quantity: quantity } },
            { new: true }
        ).exec();
    }
}