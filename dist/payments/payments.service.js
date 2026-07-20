"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma/prisma.service");
const stripe_1 = __importDefault(require("stripe"));
let PaymentsService = class PaymentsService {
    configService;
    prisma;
    stripe;
    constructor(configService, prisma) {
        this.configService = configService;
        this.prisma = prisma;
        const stripeSecretKey = this.configService.get('STRIPE_SECRET_KEY');
        if (stripeSecretKey) {
            this.stripe = new stripe_1.default(stripeSecretKey, {
                apiVersion: '2026-06-24.dahlia',
            });
        }
    }
    async createPaymentIntent(orderId, amount) {
        if (!this.stripe) {
            return { clientSecret: 'mock_client_secret_for_dev', orderId };
        }
        try {
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount: Math.round(amount * 100),
                currency: 'usd',
                metadata: { orderId },
            });
            return {
                clientSecret: paymentIntent.client_secret,
                orderId,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async handleWebhook(signature, payload) {
        if (!this.stripe)
            return { received: true };
        const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');
        let event;
        try {
            event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
        }
        catch (err) {
            throw new common_1.BadRequestException(`Webhook Error: ${err.message}`);
        }
        switch (event.type) {
            case 'payment_intent.succeeded':
                const paymentIntent = event.data.object;
                await this.handlePaymentSuccess(paymentIntent);
                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
        }
        return { received: true };
    }
    async handlePaymentSuccess(paymentIntent) {
        const orderId = paymentIntent.metadata.orderId;
        if (!orderId)
            return;
        await this.prisma.$transaction(async (tx) => {
            await tx.payment.create({
                data: {
                    orderId,
                    provider: 'stripe',
                    transactionId: paymentIntent.id,
                    amount: paymentIntent.amount / 100,
                    currency: paymentIntent.currency.toUpperCase(),
                    status: 'succeeded',
                },
            });
            await tx.order.update({
                where: { id: orderId },
                data: { status: 'CONFIRMED' },
            });
            await tx.orderStatusHistory.create({
                data: {
                    orderId,
                    status: 'CONFIRMED',
                    note: 'Payment received via Stripe',
                },
            });
        });
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map