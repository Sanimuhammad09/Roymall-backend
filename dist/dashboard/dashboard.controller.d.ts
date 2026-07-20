import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getStats(): Promise<{
        totalRevenue: number;
        ordersCount: number;
        customersCount: number;
        productsInStock: number;
        revenueChange: string;
        ordersChange: string;
    }>;
    getRevenueData(): Promise<{
        name: string;
        sales: number;
    }[]>;
    getRecentOrders(): Promise<{
        id: string;
        customer: string;
        email: string;
        amount: number;
        status: import(".prisma/client").$Enums.OrderStatus;
        date: Date;
    }[]>;
    getAnalytics(): Promise<{
        revenue: {
            current: number;
            previous: number;
            growth: string;
            orders: number;
        };
        orders: {
            current: number;
            previous: number;
            growth: string;
        };
        customers: {
            current: number;
            previous: number;
            growth: string;
        };
        topProducts: {
            productName: string;
            color: string;
            size: string;
            quantity: number | null;
        }[];
        orderStatusBreakdown: {
            status: import(".prisma/client").$Enums.OrderStatus;
            count: number;
        }[];
    }>;
}
