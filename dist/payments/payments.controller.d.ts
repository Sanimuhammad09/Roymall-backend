import { PaymentsService } from './payments.service';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    createPaymentIntent(body: {
        orderId: string;
        amount: number;
    }): Promise<{
        clientSecret: string | null;
        orderId: string;
    }>;
    handleWebhook(signature: string, req: any): Promise<{
        received: boolean;
    }>;
}
