import { Controller, Get, Post, Body, Param, Delete, Query, Put } from '@nestjs/common';
import { CashRegisterService } from './cash-register.service';
import { AuditLog } from '../audit/audit-log.decorator';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Controller('cash-register')
export class CashRegisterController {
    constructor(private readonly cashRegisterService: CashRegisterService) { }

    @AuditLog()
    @Post('open-shift')
    openShift(@Body() openShiftDto: any) {
        return this.cashRegisterService.openShift(openShiftDto);
    }

    @AuditLog()
    @Put('close-shift/:id')
    closeShift(@Param('id') id: string, @Body() closeShiftDto: any) {
        return this.cashRegisterService.closeShift(id, closeShiftDto);
    }

    @AuditLog()
    @Post('close-cash')
    closeCashRegister(@Body() closeCashDto: any) {
        return this.cashRegisterService.closeCashRegister(closeCashDto);
    }

    @Get('shift-report/:id')
    getShiftReport(@Param('id') id: string) {
        return this.cashRegisterService.getShiftReport(id);
    }

    @Get('cash-closing-report/:id')
    getCashClosingReport(@Param('id') id: string) {
        return this.cashRegisterService.getCashClosingReport(id);
    }

    @Get('transactions')
    getTransactions(@Query() filters: any, @Query() paginationDto: PaginationDto) {
        return this.cashRegisterService.getTransactions(filters, paginationDto);
    }

    @Get('transactions/date-range')
    getTransactionsByDateRange(
        @Query('startDate') startDate: Date,
        @Query('endDate') endDate: Date,
        @Query() paginationDto: PaginationDto
    ) {
        return this.cashRegisterService.getTransactionsByDateRange(startDate, endDate, paginationDto);
    }

    @AuditLog()
    @Post('transaction')
    addTransaction(@Body() transaction: any) {
        return this.cashRegisterService.addTransaction(transaction);
    }

    @Get('current-status')
    getCurrentCashStatus() {
        return this.cashRegisterService.getCurrentCashStatus();
    }

    @Get('daily-summary')
    getDailySummary(@Query('date') date: Date) {
        return this.cashRegisterService.getDailySummary(date);
    }

    @Get('monthly-summary')
    getMonthlySummary(@Query('year') year: number, @Query('month') month: number) {
        return this.cashRegisterService.getMonthlySummary(year, month);
    }

    @Get('yearly-summary')
    getYearlySummary(@Query('year') year: number) {
        return this.cashRegisterService.getYearlySummary(year);
    }

    @Get('open-shifts')
    getOpenShifts() {
        return this.cashRegisterService.getOpenShifts();
    }

    @Get('closed-shifts')
    getClosedShifts(@Query() paginationDto: PaginationDto) {
        return this.cashRegisterService.getClosedShifts(paginationDto);
    }

    @Get('cash-closings')
    getCashClosings(@Query() paginationDto: PaginationDto) {
        return this.cashRegisterService.getCashClosings(paginationDto);
    }
}