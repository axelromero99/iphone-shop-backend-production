
import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { InventoryService } from './inventory.service';
// import { CreateInventoryItemDto } from './dto/create-inventory-item.dto';
// import { UpdateInventoryItemDto } from './dto/update-inventory-item.dto';
import { AuditLog } from 'src/audit/audit-log.decorator';

@Controller('inventory')
export class InventoryController {
    constructor(private readonly inventoryService: InventoryService) { }

    @AuditLog()
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

    @AuditLog()
    @Put(':id')
    update(@Param('id') id: string, @Body() updateInventoryItemDto: any) {
        return this.inventoryService.update(id, updateInventoryItemDto);
    }

    @AuditLog()
    @Delete(':id')
    delete(@Param('id') id: string, @Query('permanent') permanent: boolean) {
        if (permanent) {
            return this.inventoryService.permanentDelete(id);
        } else {
            return this.inventoryService.softDelete(id);
        }
    }

    @AuditLog()
    @Put(':id/stock')
    updateStock(@Param('id') id: string, @Body('quantity') quantity: number) {
        return this.inventoryService.updateStock(id, quantity);
    }
}
