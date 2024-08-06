

// src/expenses/expenses.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
// import { CreateExpenseDto } from './dto/create-expense.dto';
// import { UpdateExpenseDto } from './dto/update-expense.dto';
import { AuditLog } from 'src/audit/audit-log.decorator';

@Controller('expenses')
export class ExpensesController {
    constructor(private readonly expensesService: ExpensesService) { }

    @AuditLog()
    @Post()
    create(@Body() createExpenseDto: any) {
        return this.expensesService.create(createExpenseDto);
    }

    @AuditLog()

    @Get()
    findAll() {
        return this.expensesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.expensesService.findOne(id);
    }

    @AuditLog()
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateExpenseDto: any) {
        return this.expensesService.update(id, updateExpenseDto);
    }

    @AuditLog()
    @Delete(':id')
    delete(@Param('id') id: string, @Query('permanent') permanent: boolean) {
        if (permanent) {
            return this.expensesService.permanentDelete(id);
        } else {
            return this.expensesService.softDelete(id);
        }
    }


    @Get('monthly-report')
    getMonthlyExpenses(@Query('year') year: number, @Query('month') month: number) {
        return this.expensesService.getMonthlyExpenses(year, month);
    }
}