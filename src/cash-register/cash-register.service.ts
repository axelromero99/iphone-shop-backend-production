
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// import { CreateCashRegisterDto } from './dto/create-cash-register.dto';
// import { UpdateCashRegisterDto } from './dto/update-cash-register.dto';
import { PaginationDto, SortOrder } from 'src/common/dtos/pagination.dto';

import { PaginationService } from 'src/common/services/pagination.service';
import { CashRegister, CashRegisterDocument } from 'src/schemas/cash-register.schema';
import { Transaction, TransactionDocument } from 'src/schemas/transaction.schema';



@Injectable()
export class CashRegisterService {
    constructor(
        @InjectModel(CashRegister.name) private cashRegisterModel: Model<CashRegisterDocument>,
        @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>,
        private readonly paginationService: PaginationService,
    ) { }




    async findPaginated(paginationDto: PaginationDto) {
        return this.paginationService.paginate(this.cashRegisterModel, paginationDto);
    }

    async create(createCashRegisterDto: any) {
        const createdCashRegister = new this.cashRegisterModel(createCashRegisterDto);
        return createdCashRegister.save();
    }

    async findAll() {
        return this.cashRegisterModel.find().exec();
    }

    async findOne(id: string) {
        return this.cashRegisterModel.findById(id).exec();
    }

    async update(id: string, updateCashRegisterDto: any) {
        return this.cashRegisterModel.findByIdAndUpdate(id, updateCashRegisterDto, { new: true }).exec();
    }

    async softDelete(id: string): Promise<CashRegister> {
        const cashRegister = await this.cashRegisterModel.findById(id);
        if (!cashRegister) {
            throw new NotFoundException(`InventoryItem with ID "${id}" not found`);
        }
        cashRegister.isDeleted = true;
        return cashRegister.save();
    }

    async permanentDelete(id: string): Promise<CashRegister> {
        const cashRegister = await this.cashRegisterModel.findByIdAndDelete(id).exec();
        if (!cashRegister) {
            throw new NotFoundException(`Product with ID "${id}" not found`);
        }
        return cashRegister;
    }

    async addIncome(amount: number, description: string, session?: any): Promise<void> {
        const currentShift: any = await this.getCurrentShift();
        if (!currentShift) {
            throw new NotFoundException('No hay un turno abierto actualmente');
        }

        const transaction = new this.transactionModel({
            type: 'income',
            amount,
            description,
            shiftId: currentShift._id,
        });

        await transaction.save({ session });

        currentShift.transactions.push(transaction._id);
        currentShift.cashInDrawer += amount;
        await currentShift.save({ session });
    }

    async addExpense(amount: number, description: string, session?: any): Promise<void> {
        const currentShift: any = await this.getCurrentShift();
        if (!currentShift) {
            throw new NotFoundException('No hay un turno abierto actualmente');
        }

        if (currentShift.cashInDrawer < amount) {
            throw new BadRequestException('No hay suficiente efectivo en caja para este gasto');
        }

        const transaction = new this.transactionModel({
            type: 'expense',
            amount,
            description,
            shiftId: currentShift._id,
        });

        await transaction.save({ session });

        currentShift.transactions.push(transaction._id);
        currentShift.cashInDrawer -= amount;
        await currentShift.save({ session });
    }

    async getCurrentShift(): Promise<CashRegister | null> {
        return this.cashRegisterModel.findOne({ isClosed: false }).sort({ openingTime: -1 }).exec();
    }

    async openShift(openShiftDto: any): Promise<CashRegister> {
        const newShift = new this.cashRegisterModel(openShiftDto);
        return newShift.save();
    }

    async closeShift(id: string, closeShiftDto: any): Promise<CashRegister> {
        const shift = await this.cashRegisterModel.findById(id);
        if (!shift || shift.isClosed) {
            throw new NotFoundException(`Shift with ID "${id}" not found or already closed`);
        }
        Object.assign(shift, closeShiftDto);
        shift.isClosed = true;
        shift.closingTime = new Date();
        return shift.save();
    }

    async getShiftReport(id: string): Promise<any> {
        const shift = await this.cashRegisterModel.findById(id).populate('transactions');
        if (!shift) {
            throw new NotFoundException(`Shift with ID "${id}" not found`);
        }

        const transactions = await this.transactionModel.find({ _id: { $in: shift.transactions } });

        return {
            shiftId: shift._id,
            cashier: shift.cashier,
            shift: shift.shift,
            openingTime: shift.openingTime,
            closingTime: shift.closingTime,
            openingBalance: shift.openingBalance,
            closingBalance: shift.closingBalance,
            salesBreakdown: {
                cash: shift.cashInDrawer - shift.openingBalance,
                creditCard: shift.creditCardTotal,
                debitCard: shift.debitCardTotal,
                other: shift.otherPaymentTotal
            },
            totalSales: shift.closingBalance - shift.openingBalance,
            discrepancy: shift.discrepancy,
            transactions: transactions,
            notes: shift.notes
        };
    }

    async getDailyReport(date: Date): Promise<any> {
        const startOfDay = new Date(date.setHours(0, 0, 0, 0));
        const endOfDay = new Date(date.setHours(23, 59, 59, 999));

        const shifts = await this.cashRegisterModel.find({
            openingTime: { $gte: startOfDay, $lte: endOfDay },
            isClosed: true
        }).populate('transactions');

        let totalSales = 0;
        let totalCash = 0;
        let totalCredit = 0;
        let totalDebit = 0;
        let totalOther = 0;

        shifts.forEach(shift => {
            totalSales += shift.closingBalance - shift.openingBalance;
            totalCash += shift.cashInDrawer - shift.openingBalance;
            totalCredit += shift.creditCardTotal;
            totalDebit += shift.debitCardTotal;
            totalOther += shift.otherPaymentTotal;
        });

        return {
            date: date,
            totalSales,
            totalCash,
            totalCredit,
            totalDebit,
            totalOther,
            netProfit: totalSales,
            shifts: shifts.map(shift => ({
                shiftId: shift._id,
                cashier: shift.cashier,
                shift: shift.shift,
                sales: shift.closingBalance - shift.openingBalance,
                transactions: shift.transactions
            }))
        };
    }

    async getPeriodicReport(startDate: Date, endDate: Date): Promise<any> {
        const shifts = await this.cashRegisterModel.find({
            openingTime: { $gte: startDate, $lte: endDate },
            isClosed: true
        }).populate('transactions');

        let totalSales = 0;
        let totalCash = 0;
        let totalCredit = 0;
        let totalDebit = 0;
        let totalOther = 0;

        const dailyReports = {};

        shifts.forEach(shift => {
            const shiftDate = shift.openingTime.toISOString().split('T')[0];
            if (!dailyReports[shiftDate]) {
                dailyReports[shiftDate] = {
                    totalSales: 0,
                    totalCash: 0,
                    totalCredit: 0,
                    totalDebit: 0,
                    totalOther: 0,
                    shifts: []
                };
            }

            const shiftSales = shift.closingBalance - shift.openingBalance;
            totalSales += shiftSales;
            totalCash += shift.cashInDrawer - shift.openingBalance;
            totalCredit += shift.creditCardTotal;
            totalDebit += shift.debitCardTotal;
            totalOther += shift.otherPaymentTotal;

            dailyReports[shiftDate].totalSales += shiftSales;
            dailyReports[shiftDate].totalCash += shift.cashInDrawer - shift.openingBalance;
            dailyReports[shiftDate].totalCredit += shift.creditCardTotal;
            dailyReports[shiftDate].totalDebit += shift.debitCardTotal;
            dailyReports[shiftDate].totalOther += shift.otherPaymentTotal;
            dailyReports[shiftDate].shifts.push({
                shiftId: shift._id,
                cashier: shift.cashier,
                shift: shift.shift,
                sales: shiftSales,
                transactions: shift.transactions
            });
        });

        return {
            startDate,
            endDate,
            totalSales,
            totalCash,
            totalCredit,
            totalDebit,
            totalOther,
            netProfit: totalSales,
            dailyReports
        };
    }

    async addTransaction(shiftId: string, transaction: any): Promise<void> {
        const shift = await this.cashRegisterModel.findById(shiftId);
        if (!shift) {
            throw new NotFoundException(`Shift with ID "${shiftId}" not found`);
        }
        const newTransaction: any = new this.transactionModel(transaction);
        await newTransaction.save();
        shift.transactions.push(newTransaction._id);
        await shift.save();
    }

    async getCurrentCashStatus(): Promise<any> {
        const latestShift = await this.cashRegisterModel.findOne({ isClosed: false }).sort({ openingTime: -1 });
        if (!latestShift) {
            throw new NotFoundException('No open shift found');
        }

        const transactions = await this.transactionModel.find({ _id: { $in: latestShift.transactions } });

        let currentBalance = latestShift.openingBalance;
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
            shiftId: latestShift._id,
            cashier: latestShift.cashier,
            shift: latestShift.shift,
            openingTime: latestShift.openingTime,
            currentBalance,
            openingBalance: latestShift.openingBalance,
            cashTransactions,
            creditCardTransactions,
            debitCardTransactions,
            otherTransactions,
            totalTransactions: cashTransactions + creditCardTransactions + debitCardTransactions + otherTransactions
        };
    }

    /////////////////////////////////////////////!SECTION


    async getAllShifts(paginationDto: PaginationDto) {
        return this.paginationService.paginate(this.cashRegisterModel, paginationDto);
    }

    async getOpenShifts() {
        return this.cashRegisterModel.find({ isClosed: false }).sort({ openingTime: -1 }).exec();
    }

    async getClosedShifts(paginationDto: PaginationDto) {
        // return this.paginationService.paginate(
        return this.cashRegisterModel.find({ isClosed: true }).sort({ closingTime: -1 });
        //     paginationDto
        // );
    }

    async getAllTransactions(paginationDto: PaginationDto) {
        return this.paginationService.paginate(this.transactionModel, paginationDto);
    }

    async getTransactionsByShift(shiftId: string, paginationDto: PaginationDto) {
        const shift = await this.cashRegisterModel.findById(shiftId);
        if (!shift) {
            throw new NotFoundException(`Shift with ID "${shiftId}" not found`);
        }
        return this.transactionModel.find({ _id: { $in: shift.transactions } })
    }

    async getDailySummary(date: Date) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const shifts = await this.cashRegisterModel.find({
            openingTime: { $gte: startOfDay, $lte: endOfDay },
            isClosed: true
        }).populate('transactions');

        const summary: any = this.calculateSummary(shifts);
        summary.date = date;
        summary.shiftsCount = shifts.length;

        return summary;
    }

    async getMonthlySummary(year: number, month: number) {
        const startOfMonth = new Date(year, month - 1, 1);
        const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

        const shifts = await this.cashRegisterModel.find({
            openingTime: { $gte: startOfMonth, $lte: endOfMonth },
            isClosed: true
        }).populate('transactions');

        const summary: any = this.calculateSummary(shifts);
        summary.year = year;
        summary.month = month;
        summary.shiftsCount = shifts.length;

        return summary;
    }

    async getYearlySummary(year: number) {
        const startOfYear = new Date(year, 0, 1);
        const endOfYear = new Date(year, 11, 31, 23, 59, 59, 999);

        const shifts = await this.cashRegisterModel.find({
            openingTime: { $gte: startOfYear, $lte: endOfYear },
            isClosed: true
        }).populate('transactions');

        const summary: any = this.calculateSummary(shifts);
        summary.year = year;
        summary.shiftsCount = shifts.length;

        return summary;
    }

    private calculateSummary(shifts: CashRegister[]) {
        let totalSales = 0;
        let totalCash = 0;
        let totalCredit = 0;
        let totalDebit = 0;
        let totalOther = 0;
        let totalExpenses = 0;

        shifts.forEach(shift => {
            totalSales += shift.closingBalance - shift.openingBalance;
            totalCash += shift.cashInDrawer - shift.openingBalance;
            totalCredit += shift.creditCardTotal;
            totalDebit += shift.debitCardTotal;
            totalOther += shift.otherPaymentTotal;

            shift.transactions.forEach(transaction => {
                if (transaction.type === 'expense') {
                    totalExpenses += transaction.amount;
                }
            });
        });

        return {
            totalSales,
            totalCash,
            totalCredit,
            totalDebit,
            totalOther,
            totalExpenses,
            netProfit: totalSales - totalExpenses
        };
    }
}
