// src/banner/banner.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { BannersService } from './banner.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuditLog } from '../audit/audit-log.decorator';

@Controller('banners')
export class BannerController {
    constructor(private readonly bannersService: BannersService) { }

    @AuditLog()
    @Post()
    @UseInterceptors(FileInterceptor('file'))
    create(@Body() createBannerDto: any, @UploadedFile() file: Express.Multer.File) {
        return this.bannersService.create(createBannerDto, file);
    }

    @Get()
    findAll() {
        return this.bannersService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.bannersService.findOne(id);
    }

    @AuditLog()
    @Patch(':id')
    @UseInterceptors(FileInterceptor('file'))
    update(@Param('id') id: string, @Body() updateBannerDto: any, @UploadedFile() file: Express.Multer.File) {
        return this.bannersService.update(id, updateBannerDto, file);
    }

    @AuditLog()
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.bannersService.softDelete(id);
    }

    @AuditLog()
    @Delete(':id/permanent')
    permanentDelete(@Param('id') id: string) {
        return this.bannersService.permanentDelete(id);
    }
}