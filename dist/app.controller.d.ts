import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
export declare class AppController {
    private readonly appService;
    private readonly prisma;
    constructor(appService: AppService, prisma: PrismaService);
    getHello(): string;
    seed(): Promise<{
        status: string;
        message: string;
        error?: undefined;
    } | {
        status: string;
        error: any;
        message?: undefined;
    }>;
}
