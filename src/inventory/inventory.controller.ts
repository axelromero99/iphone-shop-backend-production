
import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { InventoryService } from './inventory.service';
// import { CreateInventoryItemDto } from './dto/create-inventory-item.dto';
// import { UpdateInventoryItemDto } from './dto/update-inventory-item.dto';

@Controller('inventory')
export class InventoryController {
    constructor(private readonly inventoryService: InventoryService) { }

    @Post()
    create(@Body() createInventoryItemDto: any) {
        return this.inventoryService.create(createInventoryItemDto);
    }

    @Get()
    findAll() {
        return this.inventoryService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.inventoryService.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateInventoryItemDto: any) {
        return this.inventoryService.update(id, updateInventoryItemDto);
    }

    // @Delete(':id')
    // remove(@Param('id') id: string) {
    //     return this.inventoryService.remove(id);
    // }

    @Put(':id/stock')
    updateStock(@Param('id') id: string, @Body('quantity') quantity: number) {
        return this.inventoryService.updateStock(id, quantity);
    }
}
