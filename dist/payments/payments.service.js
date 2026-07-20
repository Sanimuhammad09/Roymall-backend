"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const crypto = __importStar(require("crypto"));
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
    async initializePaystackTransaction(orderId, amount, paymentMethod = 'card') {
        const paystackSecretKey = this.configService.get('PAYSTACK_SECRET_KEY');
        if (!paystackSecretKey) {
            throw new common_1.BadRequestException('Paystack secret key is not configured');
        }
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: { user: true },
        });
        if (!order) {
            throw new common_1.BadRequestException('Order not found');
        }
        const email = order.user.email;
        const amountInKobo = Math.round(amount * 100);
        try {
            const response = await fetch('https://api.paystack.co/transaction/initialize', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${paystackSecretKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    amount: amountInKobo,
                    reference: orderId,
                    currency: 'NGN',
                    channels: paymentMethod === 'bank_transfer' ? ['bank_transfer'] : ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer'],
                    callback_url: `${this.configService.get('FRONTEND_URL')}/checkout/success?orderId=${orderId}`,
                }),
            });
            const data = await response.json();
            if (!data.status) {
                throw new common_1.BadRequestException(`Paystack Error: ${data.message}`);
            }
            return {
                authorizationUrl: data.data.authorization_url,
                accessCode: data.data.access_code,
                reference: data.data.reference,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async handlePaystackWebhook(signature, payload) {
        const paystackSecretKey = this.configService.get('PAYSTACK_SECRET_KEY');
        if (!paystackSecretKey)
            return { received: true };
        const hash = crypto.createHmac('sha512', paystackSecretKey).update(JSON.stringify(payload)).digest('hex');
        if (hash !== signature) {
            throw new common_1.BadRequestException('Invalid Paystack Signature');
        }
        const event = payload.event;
        const data = payload.data;
        switch (event) {
            case 'charge.success':
                await this.handlePaystackSuccess(data);
                break;
            default:
                console.log(`Unhandled Paystack event type: ${event}`);
        }
        return { received: true };
    }
    async handlePaystackSuccess(data) {
        const orderId = data.reference;
        if (!orderId)
            return;
        const order = await this.prisma.order.findUnique({ where: { id: orderId } });
        if (!order || order.status === 'CONFIRMED')
            return;
        await this.prisma.$transaction(async (tx) => {
            const existingPayment = await tx.payment.findUnique({ where: { transactionId: String(data.id) } });
            if (!existingPayment) {
                await tx.payment.create({
                    data: {
                        orderId,
                        provider: 'paystack',
                        transactionId: String(data.id),
                        amount: data.amount / 100,
                        currency: data.currency.toUpperCase(),
                        status: 'succeeded',
                    },
                });
            }
            await tx.order.update({
                where: { id: orderId },
                data: { status: 'CONFIRMED' },
            });
            await tx.orderStatusHistory.create({
                data: {
                    orderId,
                    status: 'CONFIRMED',
                    note: 'Payment received via Paystack (incl. Bank Transfer)',
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