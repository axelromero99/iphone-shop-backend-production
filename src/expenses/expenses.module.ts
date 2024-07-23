
// src/expenses/expenses.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExpensesService } from './expenses.service';
import { ExpensesController } from './expenses.controller';
import { ExpenseSchema } from '../schemas/expense.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Expense', schema: ExpenseSchema }])],
    providers: [ExpensesService],
    controllers: [ExpensesController],
})
export class ExpensesModule { }