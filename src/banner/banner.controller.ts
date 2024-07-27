

// src/banner/banner.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { BannersService } from './banner.service';
// import { CreateExpenseDto } from './dto/create-expense.dto';
// import { UpdateExpenseDto } from './dto/update-expense.dto';

@Controller('banner')
export class BannersController {
    constructor(private readonly bannerService: BannersService) { }

    @Post()
    create(@Body() createExpenseDto: any) {
        return this.bannerService.create(createExpenseDto);
    }

    @Get()
    findAll() {
        return this.bannerService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.bannerService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateExpenseDto: any) {
        return this.bannerService.update(id, updateExpenseDto);
    }

    @Delete(':id')
    delete(@Param('id') id: string, @Query('permanent') permanent: boolean) {
        if (permanent) {
            return this.bannerService.permanentDelete(id);
        } else {
            return this.bannerService.softDelete(id);
        }
    }
}