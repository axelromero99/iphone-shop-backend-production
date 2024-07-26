
// src/expenses/expenses.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExpensesService } from './expenses.service';
import { ExpensesController } from './expenses.controller';
import { ExpenseSchema } from '../schemas/expense.schema';
import { CommonModule } from 'src/common/common.module';


@Module({
    imports: [MongooseModule.forFeature([{ name: 'Expense', schema: ExpenseSchema }]),
        CommonModule,
    ],
    providers: [ExpensesService],
    controllers: [ExpensesController],
})
export class ExpensesModule { }