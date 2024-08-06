// src/banner/banner.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { PaginationService } from 'src/common/services/pagination.service';
import { Banner, BannerDocument } from 'src/schemas/banner.schema';
import { CloudinaryService } from 'src/common/services/cloudinary.service';
import { AuditLogService } from 'src/audit/audit-log.service';
import { CashRegisterService } from 'src/cash-register/cash-register.service';
import { TechnicalServiceService } from 'src/technical-service/technical-service.service';
import { SalesService } from 'src/sales/sales.service';
import { ExpensesService } from 'src/expenses/expenses.service';


@Injectable()
export class ReportService {
    constructor(
        private readonly cashRegisterService: CashRegisterService,
        private readonly salesService: SalesService,
        private readonly technicalServiceService: TechnicalServiceService,
        private readonly expenseService: ExpensesService,
    ) { }

    async getComprehensiveReport(startDate: Date, endDate: Date): Promise<any> {
        const cashRegisterReport = await this.cashRegisterService.getPeriodicReport(startDate, endDate);
        const salesReport = await this.salesService.getPeriodicReport(startDate, endDate);
        const technicalServiceReport = await this.technicalServiceService.getPeriodicReport(startDate, endDate);
        const expenseReport = await this.expenseService.getPeriodicReport(startDate, endDate);

        return {
            period: { startDate, endDate },
            cashRegister: cashRegisterReport,
            sales: salesReport,
            technicalServices: technicalServiceReport,
            expenses: expenseReport,
            summary: {
                totalRevenue: cashRegisterReport.totalSales,
                totalExpenses: expenseReport.totalAmount,
                netProfit: cashRegisterReport.totalSales - expenseReport.totalAmount,
                salesCount: salesReport.totalCount,
                technicalServicesCount: technicalServiceReport.totalCount,
                expensesCount: expenseReport.totalCount
            }
        };
    }

    async getDashboardData(): Promise<any> {
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        const dailySummary = await this.cashRegisterService.getDailySummary(today);
        const monthlySummary = await this.cashRegisterService.getMonthlySummary(today.getFullYear(), today.getMonth() + 1);
        const currentCashStatus = await this.cashRegisterService.getCurrentCashStatus();
        const recentSales = await this.salesService.getRecentSales(10);
        const recentTechnicalServices = await this.technicalServiceService.getRecentServices(10);
        const lowStockItems = await this.inventoryService.getLowStockItems();

        return {
            daily: dailySummary,
            monthly: monthlySummary,
            currentCashStatus,
            recentSales,
            recentTechnicalServices,
            lowStockItems,
        };
    }
}