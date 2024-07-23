
import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { TechnicalServiceService } from './technical-service.service';
// import { CreateTechnicalServiceDto } from './dto/create-technical-service.dto';
// import { UpdateTechnicalServiceDto } from './dto/update-technical-service.dto';

@Controller('technical-service')
export class TechnicalServiceController {
    constructor(private readonly technicalServiceService: TechnicalServiceService) { }

    @Post()
    async create(@Body() createTechnicalServiceDto: any) {
        createTechnicalServiceDto.trackingCode = await this.technicalServiceService.generateTrackingCode();
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

    @Put(':id')
    update(@Param('id') id: string, @Body() updateTechnicalServiceDto: any) {
        return this.technicalServiceService.update(id, updateTechnicalServiceDto);
    }

    // @Delete(':id')
    // remove(@Param('id') id: string) {
    //     return this.technicalServiceService.remove(id);
    // }
}
