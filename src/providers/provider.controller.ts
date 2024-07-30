
// src/providers/providers.controller.ts
import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ProvidersService } from './provider.service';
// import { CreateProviderDto } from './dto/create-provider.dto';
// import { UpdateProviderDto } from './dto/update-provider.dto';
import { AuditLog } from 'src/audit/audit-log.decorator';

@Controller('providers')
export class ProvidersController {
    constructor(private readonly providersService: ProvidersService) { }

    @AuditLog()
    @Post()
    async create(@Body() createProviderDto: any) {
        createProviderDto.trackingCode = await this.providersService.generateTrackingCode();
        return this.providersService.create(createProviderDto);
    }

    @Get()
    findAll() {
        return this.providersService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.providersService.findOne(id);
    }

    @AuditLog()
    @Put(':id')
    update(@Param('id') id: string, @Body() updateProviderDto: any) {
        return this.providersService.update(id, updateProviderDto);
    }

    @AuditLog()
    @Delete(':id')
    delete(@Param('id') id: string, @Query('permanent') permanent: boolean) {
        if (permanent) {
            return this.providersService.permanentDelete(id);
        } else {
            return this.providersService.softDelete(id);
        }
    }
}