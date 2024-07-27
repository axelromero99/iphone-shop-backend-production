

// src/expenses/expenses.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
// import { CreateExpenseDto } from './dto/create-expense.dto';
// import { UpdateExpenseDto } from './dto/update-expense.dto';

@Controller('expenses')
export class ExpensesController {
    constructor(private readonly expensesService: ExpensesService) { }

    @Post()
    create(@Body() createExpenseDto: any) {
        return this.expensesService.create(createExpenseDto);
    }

    @Get()
    findAll() {
        return this.expensesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.expensesService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateExpenseDto: any) {
        return this.expensesService.update(id, updateExpenseDto);
    }

    @Delete(':id')
    delete(@Param('id') id: string, @Query('permanent') permanent: boolean) {
        if (permanent) {
            return this.expensesService.permanentDelete(id);
        } else {
            return this.expensesService.softDelete(id);
        }
    }
}