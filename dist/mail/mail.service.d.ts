import { ConfigService } from '@nestjs/config';
export declare class MailService {
    private readonly configService;
    private transporter;
    constructor(configService: ConfigService);
    private get from();
    sendWelcomeEmail(to: string, firstName: string): Promise<void>;
    sendPasswordResetEmail(to: string, firstName: string, resetToken: string): Promise<void>;
    sendOrderConfirmationEmail(to: string, firstName: string, orderNumber: string, totalAmount: number): Promise<void>;
}
