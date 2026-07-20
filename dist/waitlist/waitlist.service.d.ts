import { PrismaService } from '../prisma/prisma.service';
import { JoinWaitlistDto } from './dto/waitlist.dto';
export declare class WaitlistService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    join(dto: JoinWaitlistDto): Promise<{
        id: string;
        email: string;
        createdAt: Date;
        userId: string | null;
        productId: string;
        isNotified: boolean;
    }>;
    notifyWaitlist(productId: string): Promise<{
        notifiedCount: number;
    }>;
}
