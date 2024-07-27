
// src/sales/sales.controller.ts
import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { SalesService } from './sales.service';
// import { CreateSaleDto } from './dto/create-sale.dto';
// import { UpdateSaleDto } from './dto/update-sale.dto';

@Controller('sales')
export class SalesController {
    constructor(private readonly salesService: SalesService) { }

    @Post()
    async create(@Body() createSaleDto: any) {
        createSaleDto.trackingCode = await this.salesService.generateTrackingCode();
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

    @Put(':id')
    update(@Param('id') id: string, @Body() updateSaleDto: any) {
        return this.salesService.update(id, updateSaleDto);
    }

    @Delete(':id')
    delete(@Param('id') id: string, @Query('permanent') permanent: boolean) {
        if (permanent) {
            return this.salesService.permanentDelete(id);
        } else {
            return this.salesService.softDelete(id);
        }
    }
}