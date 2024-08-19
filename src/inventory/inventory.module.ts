// src/inventory/inventory.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { InventoryItem, InventoryItemSchema } from '../schemas/inventory-item.schema';
import { CommonModule } from '../common/common.module';

@Module({
    imports: [MongooseModule.forFeature([{ name: InventoryItem.name, schema: InventoryItemSchema }]),
        CommonModule,
    ],
    providers: [InventoryService],
    controllers: [InventoryController],
    exports: [InventoryService],
})
export class InventoryModule { }
