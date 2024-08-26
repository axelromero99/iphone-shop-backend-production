import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExpensesService } from './expenses.service';
import { ExpensesController } from './expenses.controller';
import { ExpenseSchema } from '../schemas/expense.schema';
import { CommonModule } from '../common/common.module';
import { CashRegisterModule } from '../cash-register/cash-register.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Expense', schema: ExpenseSchema }]),
        CommonModule,
        CashRegisterModule, // Añade esta línea
    ],
    providers: [ExpensesService],
    controllers: [ExpensesController],
    exports: [ExpensesService],
})
export class ExpensesModule { }