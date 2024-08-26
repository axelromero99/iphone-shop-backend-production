import { Injectable, NotFoundException } from '@nestjs/common';

import { CashRegisterService } from '../cash-register/cash-register.service';
import { TechnicalServiceService } from '../technical-service/technical-service.service';
import { SalesService } from '../sales/sales.service';
import { ExpensesService } from '../expenses/expenses.service';
import { InventoryService } from '../inventory/inventory.service';


@Injectable()
export class ReportService {
    constructor(
        private readonly cashRegisterService: CashRegisterService,
        private readonly salesService: SalesService,
        private readonly technicalServiceService: TechnicalServiceService,
        private readonly expenseService: ExpensesService,
        private readonly inventoryService: InventoryService,
    ) { }

    async getComprehensiveReport(startDate: Date, endDate: Date): Promise<any> {
        const [cashRegisterReport, salesReport, technicalServiceReport, expenseReport] = await Promise.all([
            this.cashRegisterService.getPeriodicReport(startDate, endDate),
            this.salesService.getPeriodicReport(startDate, endDate),
            this.technicalServiceService.getPeriodicReport(startDate, endDate),
            this.expenseService.getPeriodicReport(startDate, endDate)
        ]);

        const totalRevenue = salesReport.totalSales + technicalServiceReport.totalRevenue;
        const netProfit = totalRevenue - expenseReport.totalExpenses;

        return {
            period: { startDate, endDate },
            cashRegister: cashRegisterReport,
            sales: salesReport,
            technicalServices: technicalServiceReport,
            expenses: expenseReport,
            summary: {
                totalRevenue,
                totalExpenses: expenseReport.totalExpenses,
                netProfit,
                salesCount: salesReport.salesCount,
                technicalServicesCount: technicalServiceReport.totalServices,
                expensesCount: expenseReport.expenseCount
            }
        };
    }

    async getDashboardData(): Promise<any> {
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));

        const [
            dailySummary,
            currentCashStatus,
            recentSales,
            recentTechnicalServices,
            lowStockItems
        ] = await Promise.all([
            this.getComprehensiveReport(startOfDay, endOfDay),
            this.cashRegisterService.getCurrentCashStatus(),
            this.salesService.getRecentSales(10),
            this.technicalServiceService.getRecentServices(10),
            this.inventoryService.getLowStockItems()
        ]);

        return {
            dailySummary,
            currentCashStatus,
            recentSales,
            recentTechnicalServices,
            lowStockItems,
        };
    }
}