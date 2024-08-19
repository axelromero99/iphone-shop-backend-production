
import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { TechnicalServiceService } from './technical-service.service';
// import { CreateTechnicalServiceDto } from './dto/create-technical-service.dto';
// import { UpdateTechnicalServiceDto } from './dto/update-technical-service.dto';
import { AuditLog } from '../audit/audit-log.decorator';

@Controller('technical-service')
export class TechnicalServiceController {
    constructor(private readonly technicalServiceService: TechnicalServiceService) { }

    @AuditLog()
    @Post()
    async create(@Body() createTechnicalServiceDto: any) {
        // createTechnicalServiceDto.trackingCode = await this.technicalServiceService.generateTrackingCode();
        return this.technicalServiceService.create(createTechnicalServiceDto);
    }

    @Get()
    findAll() {
        return this.technicalServiceService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.technicalServiceService.findOne(id);
    }

    @AuditLog()
    @Put(':id')
    update(@Param('id') id: string, @Body() updateTechnicalServiceDto: any) {
        return this.technicalServiceService.update(id, updateTechnicalServiceDto);
    }

    @AuditLog()
    @Delete(':id')
    delete(@Param('id') id: string, @Query('permanent') permanent: boolean) {
        if (permanent) {
            return this.technicalServiceService.permanentDelete(id);
        } else {
            return this.technicalServiceService.softDelete(id);
        }
    }
}
