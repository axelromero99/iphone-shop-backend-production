
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put } from '@nestjs/common';
import { CashRegisterService } from './cash-register.service';
// import { CreateCashRegisterDto } from './dto/create-cash-register.dto';
// import { UpdateCashRegisterDto } from './dto/update-cash-register.dto';
import { AuditLog } from 'src/audit/audit-log.decorator';

@Controller('cash-register')
export class CashRegisterController {
    constructor(private readonly cashRegisterService: CashRegisterService) { }

    @AuditLog()
    @Post()
    create(@Body() createCashRegisterDto: any) {
        return this.cashRegisterService.create(createCashRegisterDto);
    }

    @Get()
    findAll() {
        return this.cashRegisterService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.cashRegisterService.findOne(id);
    }

    @AuditLog()
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateCashRegisterDto: any) {
        return this.cashRegisterService.update(id, updateCashRegisterDto);
    }

    @AuditLog()
    @Delete(':id')
    delete(@Param('id') id: string, @Query('permanent') permanent: boolean) {
        if (permanent) {
            return this.cashRegisterService.permanentDelete(id);
        } else {
            return this.cashRegisterService.softDelete(id);
        }
    }


    @Post('open-shift')
    // @Auth(ValidRoles.admin, ValidRoles.cashier)
    openShift(@Body() openShiftDto: any) {
        return this.cashRegisterService.openShift(openShiftDto);
    }

    @Put(':id/close-shift')
    // @Auth(ValidRoles.admin, ValidRoles.cashier)
    closeShift(@Param('id') id: string, @Body() closeShiftDto: any) {
        return this.cashRegisterService.closeShift(id, closeShiftDto);
    }

    @Get('daily-report')
    // @Auth(ValidRoles.admin)
    getDailyReport(@Query('date') date: Date) {
        return this.cashRegisterService.getDailyReport(date);
    }

    @Get('shift-report/:id')
    // @Auth(ValidRoles.admin, ValidRoles.cashier)
    getShiftReport(@Param('id') id: string) {
        return this.cashRegisterService.getShiftReport(id);
    }
}