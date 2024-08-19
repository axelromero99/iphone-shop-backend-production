
// src/sales/sales.controller.ts
import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { SalesService } from './sales.service';
// import { CreateSaleDto } from './dto/create-sale.dto';
// import { UpdateSaleDto } from './dto/update-sale.dto';
import { AuditLog } from '../audit/audit-log.decorator';

@Controller('sales')
export class SalesController {
    constructor(private readonly salesService: SalesService) { }

    // @AuditLog()
    @Post()
    async create(@Body() createSaleDto: any) {
        return this.salesService.create(createSaleDto);
    }

    @Get()
    findAll() {
        return this.salesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.salesService.findOne(id);
    }

    @AuditLog()
    @Put(':id')
    update(@Param('id') id: string, @Body() updateSaleDto: any) {
        return this.salesService.update(id, updateSaleDto);
    }

    @AuditLog()
    @Delete(':id')
    delete(@Param('id') id: string, @Query('permanent') permanent: boolean) {
        if (permanent) {
            return this.salesService.permanentDelete(id);
        } else {
            return this.salesService.softDelete(id);
        }
    }
}