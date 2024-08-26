import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { ReportService } from './reports.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuditLog } from '../audit/audit-log.decorator';
@Controller('reports')
export class ReportController {
    constructor(private readonly reportService: ReportService) { }

    @Get('comprehensive')
    getComprehensiveReport(
        @Query('startDate') startDate: Date,
        @Query('endDate') endDate: Date
    ) {
        return this.reportService.getComprehensiveReport(startDate, endDate);
    }

    @Get('dashboard')
    getDashboardData() {
        return this.reportService.getDashboardData();
    }
}