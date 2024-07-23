// src/inventory/inventory.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { InventoryItem, InventoryItemSchema } from '../schemas/inventory-item.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: InventoryItem.name, schema: InventoryItemSchema }])],
    providers: [InventoryService],
    controllers: [InventoryController],
    exports: [InventoryService],
})
export class InventoryModule { }
