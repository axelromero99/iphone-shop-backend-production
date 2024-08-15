import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CashRegister, CashRegisterDocument } from '../schemas/cash-register.schema';
import { Transaction, TransactionDocument } from '../schemas/transaction.schema';
import { CashClosing, CashClosingDocument } from '../schemas/cash-closing.schema';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { PaginationService } from '../common/services/pagination.service';

@Injectable()
export class CashRegisterService {
    constructor(
        @InjectModel(CashRegister.name) private cashRegisterModel: Model<CashRegisterDocument>,
        @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>,
        @InjectModel(CashClosing.name) private cashClosingModel: Model<CashClosingDocument>,
        private readonly paginationService: PaginationService,
    ) { }

    async openShift(openShiftDto: any): Promise<CashRegister> {
        const currentOpenShift = await this.cashRegisterModel.findOne({ isClosed: false });
        if (currentOpenShift) {
            throw new BadRequestException('There is already an open shift. Please close it before opening a new one.');
        }

        const newShift = new this.cashRegisterModel(openShiftDto);
        return newShift.save();
    }

    async closeShift(id: string, closeShiftDto: any): Promise<CashRegister> {
        const shift = await this.cashRegisterModel.findById(id);
        if (!shift || shift.isClosed) {
            throw new NotFoundException(`Shift with ID "${id}" not found or already closed`);
        }

        const transactions = await this.transactionModel.find({ cashRegister: shift._id });

        let totalCash = shift.openingBalance;
        let totalCredit = 0;
        let totalDebit = 0;
        let totalOther = 0;

        transactions.forEach(transaction => {
            switch (transaction.paymentMethod) {
                case 'cash':
                    totalCash += transaction.amount;
                    break;
                case 'creditCard':
                    totalCredit += transaction.amount;
                    break;
                case 'debitCard':
                    totalDebit += transaction.amount;
                    break;
                case 'other':
                    totalOther += transaction.amount;
                    break;
            }
        });

        Object.assign(shift, closeShiftDto, {
            isClosed: true,
            closingTime: new Date(),
            closingBalance: totalCash,
            creditCardTotal: totalCredit,
            debitCardTotal: totalDebit,
            otherPaymentTotal: totalOther,
            discrepancy: closeShiftDto.cashInDrawer - totalCash
        });

        return shift.save();
    }

    async closeCashRegister(closeCashDto: any): Promise<CashClosing> {
        const openShifts = await this.cashRegisterModel.find({ isClosed: false });
        if (openShifts.length > 0) {
            throw new BadRequestException('There are open shifts. Please close all shifts before closing the cash register.');
        }

        const lastClosingDate = await this.cashClosingModel.findOne().sort({ closingDate: -1 });
        const startDate = lastClosingDate ? lastClosingDate.closingDate : new Date(0);
        const endDate = new Date();

        const shifts = await this.cashRegisterModel.find({
            closingTime: { $gt: startDate, $lte: endDate }
        }).populate('transactions');

        let totalSales = 0;
        let totalExpenses = 0;
        let cashBalance = 0;
        let creditCardTotal = 0;
        let debitCardTotal = 0;
        let otherPaymentTotal = 0;

        shifts.forEach(shift => {
            cashBalance += shift.closingBalance - shift.openingBalance;
            creditCardTotal += shift.creditCardTotal;
            debitCardTotal += shift.debitCardTotal;
            otherPaymentTotal += shift.otherPaymentTotal;

            shift.transactions.forEach((transaction: Transaction) => {
                if (transaction.type === 'sale') {
                    totalSales += transaction.amount;
                } else if (transaction.type === 'expense') {
                    totalExpenses += transaction.amount;
                }
            });
        });

        const cashClosing = new this.cashClosingModel({
            closingDate: endDate,
            totalSales,
            totalExpenses,
            netIncome: totalSales - totalExpenses,
            cashBalance,
            creditCardTotal,
            debitCardTotal,
            otherPaymentTotal,
            notes: closeCashDto.notes,
            shifts: shifts.map(shift => shift._id),
            transactions: shifts.flatMap(shift => shift.transactions.map((t: any) => t._id))
        });

        await cashClosing.save();

        // Update shifts and transactions with the cash closing reference
        await this.cashRegisterModel.updateMany(
            { _id: { $in: shifts.map(shift => shift._id) } },
            { $set: { cashClosing: cashClosing._id } }
        );

        await this.transactionModel.updateMany(
            { _id: { $in: cashClosing.transactions } },
            { $set: { cashClosing: cashClosing._id } }
        );

        return cashClosing;
    }

    async getShiftReport(id: string): Promise<any> {
        const shift = await this.cashRegisterModel.findById(id).populate('transactions');
        if (!shift) {
            throw new NotFoundException(`Shift with ID "${id}" not found`);
        }

        return {
            shiftId: shift._id,
            cashier: shift.cashier,
            shift: shift.shift,
            openingTime: shift.openingTime,
            closingTime: shift.closingTime,
            openingBalance: shift.openingBalance,
            closingBalance: shift.closingBalance,
            cashInDrawer: shift.cashInDrawer,
            creditCardTotal: shift.creditCardTotal,
            debitCardTotal: shift.debitCardTotal,
            otherPaymentTotal: shift.otherPaymentTotal,
            discrepancy: shift.discrepancy,
            transactions: shift.transactions,
            notes: shift.notes
        };
    }

    async getCashClosingReport(id: string): Promise<any> {
        const cashClosing = await this.cashClosingModel.findById(id)
            .populate('shifts')
            .populate('transactions');
        if (!cashClosing) {
            throw new NotFoundException(`Cash closing with ID "${id}" not found`);
        }

        return {
            closingId: cashClosing._id,
            closingDate: cashClosing.closingDate,
            totalSales: cashClosing.totalSales,
            totalExpenses: cashClosing.totalExpenses,
            netIncome: cashClosing.netIncome,
            cashBalance: cashClosing.cashBalance,
            creditCardTotal: cashClosing.creditCardTotal,
            debitCardTotal: cashClosing.debitCardTotal,
            otherPaymentTotal: cashClosing.otherPaymentTotal,
            notes: cashClosing.notes,
            shifts: cashClosing.shifts,
            transactions: cashClosing.transactions
        };
    }

    async getTransactions(filters: any, paginationDto: PaginationDto) {
        const query = this.transactionModel.find(filters);
        return this.paginationService.paginate(query, paginationDto);
    }

    async getTransactionsByDateRange(startDate: Date, endDate: Date, paginationDto: PaginationDto) {
        const filters = {
            createdAt: {
                $gte: startDate,
                $lte: endDate
            }
        };
        return this.getTransactions(filters, paginationDto);
    }


    async getCurrentCashStatus(): Promise<any> {
        const currentShift = await this.cashRegisterModel.findOne({ isClosed: false }).sort({ openingTime: -1 });
        if (!currentShift) {
            throw new NotFoundException('No open shift found');
        }

        const transactions = await this.transactionModel.find({ cashRegister: currentShift._id });

        let currentBalance = currentShift.openingBalance;
        let cashTransactions = 0;
        let creditCardTransactions = 0;
        let debitCardTransactions = 0;
        let otherTransactions = 0;

        transactions.forEach(transaction => {
            switch (transaction.paymentMethod) {
                case 'cash':
                    currentBalance += transaction.amount;
                    cashTransactions += transaction.amount;
                    break;
                case 'creditCard':
                    creditCardTransactions += transaction.amount;
                    break;
                case 'debitCard':
                    debitCardTransactions += transaction.amount;
                    break;
                case 'other':
                    otherTransactions += transaction.amount;
                    break;
            }
        });

        return {
            shiftId: currentShift._id,
            cashier: currentShift.cashier,
            shift: currentShift.shift,
            openingTime: currentShift.openingTime,
            currentBalance,
            openingBalance: currentShift.openingBalance,
            cashTransactions,
            creditCardTransactions,
            debitCardTransactions,
            otherTransactions,
            totalTransactions: cashTransactions + creditCardTransactions + debitCardTransactions + otherTransactions
        };
    }

    async getDailySummary(date: Date): Promise<any> {
        const startOfDay = new Date(date.setHours(0, 0, 0, 0));
        const endOfDay = new Date(date.setHours(23, 59, 59, 999));

        const shifts = await this.cashRegisterModel.find({
            openingTime: { $gte: startOfDay, $lte: endOfDay },
            isClosed: true
        }).populate('transactions');

        return this.calculateSummary(shifts, startOfDay, endOfDay);
    }

    async getMonthlySummary(year: number, month: number): Promise<any> {
        const startOfMonth = new Date(year, month - 1, 1);
        const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

        const shifts = await this.cashRegisterModel.find({
            openingTime: { $gte: startOfMonth, $lte: endOfMonth },
            isClosed: true
        }).populate('transactions');

        return this.calculateSummary(shifts, startOfMonth, endOfMonth);
    }

    async getYearlySummary(year: number): Promise<any> {
        const startOfYear = new Date(year, 0, 1);
        const endOfYear = new Date(year, 11, 31, 23, 59, 59, 999);

        const shifts = await this.cashRegisterModel.find({
            openingTime: { $gte: startOfYear, $lte: endOfYear },
            isClosed: true
        }).populate('transactions');

        return this.calculateSummary(shifts, startOfYear, endOfYear);
    }

    private calculateSummary(shifts: CashRegister[], startDate: Date, endDate: Date) {
        let totalSales = 0;
        let totalExpenses = 0;
        let totalCash = 0;
        let totalCredit = 0;
        let totalDebit = 0;
        let totalOther = 0;

        shifts.forEach(shift => {
            totalCash += shift.cashInDrawer - shift.openingBalance;
            totalCredit += shift.creditCardTotal;
            totalDebit += shift.debitCardTotal;
            totalOther += shift.otherPaymentTotal;

            shift.transactions.forEach((transaction: Transaction) => {
                if (transaction.type === 'sale') {
                    totalSales += transaction.amount;
                } else if (transaction.type === 'expense') {
                    totalExpenses += transaction.amount;
                }
            });
        });

        return {
            startDate,
            endDate,
            totalSales,
            totalExpenses,
            netIncome: totalSales - totalExpenses,
            totalCash,
            totalCredit,
            totalDebit,
            totalOther,
            totalTransactions: totalSales + totalExpenses,
            shiftsCount: shifts.length
        };
    }

    async getOpenShifts(): Promise<CashRegister[]> {
        return this.cashRegisterModel.find({ isClosed: false }).sort({ openingTime: -1 }).exec();
    }

    async getClosedShifts(paginationDto: PaginationDto) {
        const query = this.cashRegisterModel.find({ isClosed: true }).sort({ closingTime: -1 });
        return this.paginationService.paginate(query, paginationDto);
    }

    async getCashClosings(paginationDto: PaginationDto) {
        return this.paginationService.paginate(this.cashClosingModel, paginationDto);
    }

    async getCurrentShift(): Promise<CashRegisterDocument> {
        const currentShift = await this.cashRegisterModel.findOne({ isClosed: false }).sort({ openingTime: -1 });
        if (!currentShift) {
            throw new NotFoundException('No open shift found');
        }
        return currentShift;
    }


    async addTransaction(transaction: Partial<Transaction>): Promise<Transaction> {
        const currentShift = await this.getCurrentShift();
        const newTransaction = new this.transactionModel({
            ...transaction,
            cashRegister: currentShift._id
        });
        await newTransaction.save();
        currentShift.transactions.push(newTransaction);
        await currentShift.save();
        return newTransaction;
    }

    async addExpense(amount: number, description: string, session?: any): Promise<void> {
        const currentShift = await this.getCurrentShift();
        await this.addTransaction({
            type: 'expense',
            amount,
            description,
            paymentMethod: 'cash',
        });
        currentShift.cashInDrawer -= amount;
        await currentShift.save({ session });
    }



    async addIncome(amount: number, description: string, session?: any): Promise<void> {
        const currentShift = await this.getCurrentShift();
        await this.addTransaction({
            type: 'income',
            amount,
            description,
            paymentMethod: 'cash',
        });
        currentShift.cashInDrawer += amount;
        await currentShift.save({ session });
    }

    async getPeriodicReport(startDate: Date, endDate: Date): Promise<any> {
        const shifts = await this.cashRegisterModel.find({
            openingTime: { $gte: startDate, $lte: endDate },
            isClosed: true
        }).populate('transactions');

        // Calculate totals
        let totalSales = 0;
        let totalExpenses = 0;
        let cashBalance = 0;
        let creditCardTotal = 0;
        let debitCardTotal = 0;
        let otherPaymentTotal = 0;

        shifts.forEach(shift => {
            cashBalance += shift.closingBalance - shift.openingBalance;
            creditCardTotal += shift.creditCardTotal;
            debitCardTotal += shift.debitCardTotal;
            otherPaymentTotal += shift.otherPaymentTotal;

            shift.transactions.forEach(transaction => {
                if (transaction.type === 'sale') {
                    totalSales += transaction.amount;
                } else if (transaction.type === 'expense') {
                    totalExpenses += transaction.amount;
                }
            });
        });

        return {
            startDate,
            endDate,
            totalSales,
            totalExpenses,
            netIncome: totalSales - totalExpenses,
            cashBalance,
            creditCardTotal,
            debitCardTotal,
            otherPaymentTotal,
            shifts
        };
    }
}