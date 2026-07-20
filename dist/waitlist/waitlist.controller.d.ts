import { WaitlistService } from './waitlist.service';
import { JoinWaitlistDto } from './dto/waitlist.dto';
export declare class WaitlistController {
    private readonly waitlistService;
    constructor(waitlistService: WaitlistService);
    join(dto: JoinWaitlistDto): Promise<{
        id: string;
        email: string;
        createdAt: Date;
        userId: string | null;
        productId: string;
        isNotified: boolean;
    }>;
}
