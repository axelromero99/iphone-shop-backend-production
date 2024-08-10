
// src/expenses/expenses.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CashRegisterService } from 'src/cash-register/cash-register.service';
// import { CreateExpenseDto } from './dto/create-expense.dto';
// import { UpdateExpenseDto } from './dto/update-expense.dto';
import { PaginationDto, SortOrder } from 'src/common/dtos/pagination.dto';

import { PaginationService } from 'src/common/services/pagination.service';
import { Expense } from 'src/schemas/expense.schema';



@Injectable()
export class ExpensesService {
    constructor(@InjectModel('Expense') private expenseModel: Model<any>,
        private readonly paginationService: PaginationService,
        private readonly cashRegisterService: CashRegisterService,

    ) { }

    async findPaginated(paginationDto: PaginationDto) {
        return this.paginationService.paginate(this.expenseModel, paginationDto);
    }

    async getPeriodicReport(startDate: Date, endDate: Date): Promise<any> {
        const expenses = await this.expenseModel.find({
            date: { $gte: startDate, $lte: endDate }
        }).exec();

        const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

        const expensesByCategory = expenses.reduce((acc, expense) => {
            if (!acc[expense.category]) {
                acc[expense.category] = 0;
            }
            acc[expense.category] += expense.amount;
            return acc;
        }, {});

        return {
            totalExpenses,
            expenseCount: expenses.length,
            expensesByCategory,
            expenses
        };
    }


    // async create(createExpenseDto: any): Promise<Expense> {
    //     const session = await this.expenseModel.db.startSession();
    //     session.startTransaction();

    //     try {
    //         const createdExpense = new this.expenseModel(createExpenseDto);
    //         await createdExpense.save({ session });

    //         // Registrar la transacción en el turno actual
    //         const currentShift: any = await this.cashRegisterService.getCurrentShift();
    //         await this.cashRegisterService.addTransaction(currentShift._id, {
    //             type: 'expense',
    //             amount: createExpenseDto.amount,
    //             paymentMethod: createExpenseDto.paymentMethod,
    //             relatedDocumentId: createdExpense._id
    //         });

    //         await session.commitTransaction();
    //         return createdExpense;
    //     } catch (error) {
    //         await session.abortTransaction();
    //         throw error;
    //     } finally {
    //         session.endSession();
    //     }
    // }


    async create(createExpenseDto: any): Promise<Expense> {
        const session = await this.expenseModel.db.startSession();
        session.startTransaction();

        try {
            const createdExpense = new this.expenseModel(createExpenseDto);
            await createdExpense.save({ session });

            // Verificar si hay un turno abierto
            const currentShift: any = await this.cashRegisterService.getCurrentShift();
            if (!currentShift) {
                throw new BadRequestException('No hay un turno de caja abierto. No se puede registrar el gasto.');
            }

            // Registrar la transacción en el turno actual
            await this.cashRegisterService.addTransaction(currentShift._id, {
                type: 'expense',
                amount: createExpenseDto.amount,
                paymentMethod: createExpenseDto.paymentMethod,
                relatedDocumentId: createdExpense._id
            });

            await session.commitTransaction();
            return createdExpense;
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    async findAll() {
        return this.expenseModel.find().exec();
    }

    async findOne(id: string) {
        return this.expenseModel.findById(id).exec();
    }

    async update(id: string, updateExpenseDto: any) {
        return this.expenseModel.findByIdAndUpdate(id, updateExpenseDto, { new: true }).exec();
    }

    async softDelete(id: string): Promise<Expense> {
        const expense = await this.expenseModel.findById(id);
        if (!expense) {
            throw new NotFoundException(`InventoryItem with ID "${id}" not found`);
        }
        expense.isDeleted = true;
        return expense.save();
    }

    async permanentDelete(id: string): Promise<Expense> {
        const expense = await this.expenseModel.findByIdAndDelete(id).exec();
        if (!expense) {
            throw new NotFoundException(`Product with ID "${id}" not found`);
        }
        return expense;
    }

    async getMonthlyExpenses(year: number, month: number): Promise<any> {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        const expenses = await this.expenseModel.find({
            date: { $gte: startDate, $lte: endDate },
            isDeleted: false
        }).exec();

        const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        const categorySummary = expenses.reduce((acc, expense) => {
            acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
            return acc;
        }, {});

        return {
            year,
            month,
            totalAmount,
            categorySummary,
            expenses
        };
    }

}